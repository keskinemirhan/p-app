import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ReqRegisterDto } from './dto/req-register.dto';
import { ReqVerifyRegisterEmailDto } from './dto/req-verify-register-email.dto';
import { ReqCreateRegisterEmailVerificationDto } from './dto/req-create-register-email-verification.dto';
import { generateException } from 'src/exception/exception';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ResRegisterDto } from './dto/res-register.dto';
import { ReqLoginDto } from './dto/req-login.dto';
import { ResLoginDto } from './dto/res-login.dto';
import { ResRefreshDto } from './dto/res-refresh.dto';
import { ReqRefreshDto } from './dto/req-refresh.dto';
import { bool } from 'joi';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private verificationExpireSeconds: number;
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private tokenService: TokenService,
    private configService: ConfigService,
  ) {
    this.verificationExpireSeconds = this.configService.get<number>("VERIFICATION_EXP_SEC");
  }

  @ApiCreatedResponse({
    type: ResRegisterDto
  })
  @ApiBody({
    type: ReqRegisterDto
  })
  @Post('register')
  async register(@Body() body: ReqRegisterDto) {
    const account = await this.accountService.create({
      ...body,
      isEmailVerified: false,
    });
    const verification = await this.authService.sendRegisterVerification(
      body.email,
      account.id,
    );

    const tokenPair = await this.authService.createSessionTokenPair(account.id);

    return {
      ...tokenPair,
      verificationId: verification.id,
    };
  }

  @ApiCreatedResponse()
  @ApiBody({
    type: ReqVerifyRegisterEmailDto
  })
  @Post('register/verify-email')
  async verifyRegisterEmail(@Body() body: ReqVerifyRegisterEmailDto) {
    const payload = await this.tokenService.verifyAccessToken(
      body.access_token,
    );
    const account = await this.accountService.getOne({ id: payload.id });
    await this.authService.verifyVerification({
      id: body.verificationId,
      email: account.email,
      code: body.code,
      type: 'register-verification',
      expireSeconds: this.verificationExpireSeconds,
    });

    account.isEmailVerified = true;
    await this.accountService.update(account.id, account);
  }

  @ApiCreatedResponse({
    type: ResRegisterDto
  })
  @ApiBody({
    type: ReqCreateRegisterEmailVerificationDto
  })
  @Post('register/create-verification')
  async createRegisterEmailVerification(
    @Body() body: ReqCreateRegisterEmailVerificationDto,
  ) {
    const payload = await this.tokenService.verifyAccessToken(
      body.access_token,
    );
    const account = await this.accountService.getOne({ id: payload.id });

    if (account.isEmailVerified)
      throw new BadRequestException(generateException('ALREADY_VERIFIED'));

    const verification = await this.authService.sendRegisterVerification(
      account.email,
      account.id,
    );

    const tokenPair = await this.authService.createSessionTokenPair(account.id);

    return {
      ...tokenPair,
      verificationId: verification.id,
    };
  }

  @ApiCreatedResponse({
    type: ResLoginDto
  })
  @ApiBody({
    type: ReqLoginDto
  })
  @Post('login')
  async login(@Body() body: ReqLoginDto) {
    const res = await this.authService.login(body.email, body.password);
    return res;

  }

  @ApiCreatedResponse({
    type: ResRefreshDto
  })
  @ApiBody({
    type: ReqRefreshDto
  })
  @Post('refresh')
  async refresh(@Body() body: ReqRefreshDto) {
    const payload = await this.tokenService.verifyRefreshToken(body.refresh_token)
    console.log(payload);
    const account = await this.accountService.getOne({ id: payload.id });
    const tokenPair = await this.authService.createSessionTokenPair(account.id);
    return tokenPair;

  }

}
