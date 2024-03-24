import { BadRequestException, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { AccountService } from 'src/account/account.service';
import { generateException } from 'src/exception/exception';
import { TokenService } from './token.service';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification } from './entities/email-verification.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

export type EmailVerificationPayload = {
  verificationId: string;
  accountId: string;
};

export type VerificationType = 'register-verification';

@Injectable()
export class AuthService {
  appEmailAddress: string;

  constructor(
    private accountService: AccountService,
    private tokenService: TokenService,
    private mailerService: MailerService,
    private configService: ConfigService,
    @InjectRepository(EmailVerification)
    private verificationRepo: Repository<EmailVerification>,
    private jwtService: JwtService,
  ) {
    this.appEmailAddress = this.configService.get<string>('APP_EMAIL');
  }

  async createSessionTokenPair(accountId: string) {
    const tokenPair = await this.tokenService.createPair({ id: accountId });
    return tokenPair;
  }

  async login(email: string, password: string) {
    const account = await this.accountService.getOne({ email });
    const result = await compare(password, account.password);
    if (!result)
      throw new BadRequestException(generateException('INVALID_CREDS'));
    const tokenPair = await this.tokenService.createPair({ id: account.id });
    return tokenPair;
  }

  async verifyVerification(params: {
    id: string;
    email: string;
    code: string;
    type: VerificationType;
    expireSeconds: number;
  }) {
    const { id, email, code, type, expireSeconds } = params;
    const verification = await this.verificationRepo.findOne({
      where: { id, email },
    });

    if (!verification)
      throw new BadRequestException(
        generateException('VERIFICATION_NOT_FOUND'),
      );
    if (verification.type !== type)
      throw new BadRequestException(generateException('WRONG_VERIFICATION'));
    if (verification.code !== code) {
      await this.verificationRepo.remove(verification);
      throw new BadRequestException(
        generateException('INVALID_VERIFICATION_CODE'),
      );
    }
    if (verification.verified)
      throw new BadRequestException(generateException('ALREADY_VERIFIED'));

    const timeDifferenceInSeconds = Math.round(
      (Date.now() - new Date(verification.createdAt).getTime()) / 1000,
    );
    if (timeDifferenceInSeconds >= expireSeconds)
      throw new BadRequestException(generateException('VERIFICATION_EXPIRED'));

    verification.verified = true;
    return await this.verificationRepo.save(verification);
  }

  async sendRegisterVerification(email: string, data: string) {
    const code = this.generateVerificationCode();
    const existingVerification = await this.verificationRepo.findOne({
      where: {
        email,
        type: 'register-verification'
      }
    })

    if (existingVerification) await this.verificationRepo.remove(existingVerification);

    const verification = await this.verificationRepo.save({
      email: email,
      data,
      type: 'register-verification',
      code,
      verified: false,
    });

    this.mailerService.sendMail({
      from: this.appEmailAddress,
      to: email,
      subject: 'Register Email Verification',
      html: code,
    });

    return verification;
  }

  generateVerificationCode() {
    let code = '';
    for (let i = 0; i < 6; i++) {
      const digit = Math.floor(Math.random() * 10);
      code += String(digit);
    }
    return code;
  }
}
