import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { Account } from './account/entities/account.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema } from './env.validation';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { EmailVerification } from './auth/entities/email-verification.entity';
import { ProfileModule } from './profile/profile.module';
import { Capability } from './profile/entities/capability.entity';
import { ContactInfo } from './profile/entities/contact-info.entity';
import { Education } from './profile/entities/education.entity';
import { Experience } from './profile/entities/experience.entity';
import { Profile } from './profile/entities/profile.entity';
import { Project } from './profile/entities/project.entity';
import { Reference } from './profile/entities/reference.entity';
import { Review } from './profile/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: configService.get<any>("DB_TYPE"),
      database: configService.get<string>("DB_NAME"),
      username: configService.get("DB_USERNAME"),
      password: configService.get("DB_PASSWORD"),
      port: configService.get("DB_PORT"),
      synchronize: configService.get("DB_SYNCHRONIZE"),
      host: configService.get("DB_HOST"),
      entities: [Account, EmailVerification, Capability, ContactInfo, Education, Experience, Profile, Project, Reference, Review],
    })
  }),
    AuthModule,
    AccountModule,
    MailerModule,
    ProfileModule,
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: envSchema,
    validationOptions: {
      allowUnknown: true,
      abortEarly: true
    }
  }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
