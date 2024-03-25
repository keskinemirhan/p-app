import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AccountModule } from "src/account/account.module";
import { AuthService } from "./auth.service";
import { TokenService } from "./token.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailVerification } from "./entities/email-verification.entity";
import { MailerModule } from "src/mailer/mailer.module";
import { AdminAccountGuard } from "./guards/admin-account.guard";
import { RegularAccountGuard } from "./guards/regular-account.guard";

@Module({
  imports: [
    MailerModule,
    AccountModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get("JWT_SECRET"),
      }),
    }),
    TypeOrmModule.forFeature([EmailVerification]),
  ],
  providers: [AuthService, TokenService, AdminAccountGuard, RegularAccountGuard],
  exports: [AdminAccountGuard, RegularAccountGuard, AuthService, TokenService],
  controllers: [AuthController],

})
export class AuthModule { }
