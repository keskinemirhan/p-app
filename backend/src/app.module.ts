import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountModule } from "./account/account.module";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env.validation";
import { MailerModule } from "./mailer/mailer.module";
import { AuthModule } from "./auth/auth.module";
import { ProfileModule } from "./profile/profile.module";
import { dataSourceOption } from "./db/ormconfig";
import { MulterModule } from "@nestjs/platform-express";
import { FileModule } from "./file/file.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOption),
    AuthModule,
    AccountModule,
    MailerModule,
    ProfileModule,
    FileModule,
    MulterModule.register({
      dest: "./upload",
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
