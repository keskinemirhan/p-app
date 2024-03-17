import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const hostname = configService.get<string>("APP_HOSTNAME");
  const port = configService.get<number>("APP_PORT");
  await app.listen(port, hostname);
}
bootstrap();
