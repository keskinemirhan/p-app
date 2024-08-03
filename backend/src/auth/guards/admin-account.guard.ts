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

@Injectable()
export class AdminAccountGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private accountService: AccountService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    try {
      if (!token) {
        throw new UnauthorizedException(generateException("UNAUTHORIZED"));
      }
      const payload = await this.tokenService.verifyAccessToken(token);
      if (!payload.id) throw new BadRequestException("UNAUTHORIZED");
      const account = await this.accountService.getOne({ id: payload.id });
      if (!account.isAdmin)
        throw new UnauthorizedException(generateException("UNAUTHORIZED"));
      request.account = account;
    } catch {
      throw new UnauthorizedException(generateException("UNAUTHORIZED"));
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
