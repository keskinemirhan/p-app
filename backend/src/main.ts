import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  const appName = configService.get<string>("APP_NAME");
  const appDesc = configService.get<string>("APP_DESCRIPTION");

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(appDesc)
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const hostname = configService.get<string>("APP_HOSTNAME");
  const port = configService.get<number>("APP_PORT");

  await app.listen(port, hostname);
}
bootstrap();
