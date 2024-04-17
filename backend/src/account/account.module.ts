import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "./entities/account.entity";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { AuthModule } from "src/auth/auth.module";
import { ProfileModule } from "src/profile/profile.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    forwardRef(() => AuthModule),
    ProfileModule,
  ],
  providers: [AccountService],
  exports: [AccountService],
  controllers: [AccountController]
})
export class AccountModule { }
