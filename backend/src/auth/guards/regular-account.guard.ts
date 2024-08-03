import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { generateException } from "src/exception/exception";
import { TokenService } from "../token.service";
import { AccountService } from "src/account/account.service";
import { Account } from "src/account/entities/account.entity";

@Injectable()
export class RegularAccountGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private accountService: AccountService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(generateException("UNAUTHORIZED"));
    }

    let payload: any;
    let account: Account;
    try {
      payload = await this.tokenService.verifyAccessToken(token);
      if (!payload.id) throw new BadRequestException("UNAUTHORIZED");
      account = await this.accountService.getOne({ id: payload.id });
    } catch {
      throw new UnauthorizedException(generateException("UNAUTHORIZED"));
    }
    if (!account.isEmailVerified)
      throw new UnauthorizedException(generateException("UNVERIFIED_ACCOUNT"));
    request.account = account;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
