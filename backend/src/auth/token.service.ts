import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { generateException } from "src/exception/exception";

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async createRefreshToken(payload: any) {
    payload.type = "refresh";
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: "48h",
    });
    return token;
  }

  async createAccessToken(payload: any) {
    payload.type = "access";
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: "30m",
    });
    return token;
  }

  async verifyToken(token: string) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException(generateException("INVALID_TOKEN"));
    }
    return payload;
  }

  async verifyAccessToken(token: string) {
    const payload = await this.verifyToken(token);

    if (payload?.type === "access") return payload;

    throw new UnauthorizedException("INVALID_TOKEN");
  }

  async verifyRefreshToken(token: string) {
    const payload = await this.verifyToken(token);

    if (payload?.type === "refresh") return payload;

    throw new UnauthorizedException("INVALID_TOKEN");
  }

  async createPair(payload: any) {
    const access_token = await this.createAccessToken(payload);
    const refresh_token = await this.createRefreshToken(payload);

    return {
      access_token,
      refresh_token,
    };
  }
}
