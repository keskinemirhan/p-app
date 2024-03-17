import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { Account } from './account/entities/account.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema } from './env.validation';

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
      entities: [Account],
    })
  }),
    AccountModule,
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: envSchema,
    validationOptions: {
      allowUnknown: true,
      abortEarly: true
    }
  }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
