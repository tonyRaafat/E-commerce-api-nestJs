// import { config } from 'dotenv';
// config();
import './instrument';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const configSwagger = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('E-commerce API description')
    .setVersion('1.0')
    .addTag('E-commerce')
    .addBearerAuth(
      {
        type: 'apiKey',
        in: 'cookie', // Specify the type as 'cookie'
        name: 'Authorization', // The name of the cookie containing the JWT token
      },
      'Authorization', // This is a key to reference the cookie auth
    )
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, documentFactory);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  await app.listen(config.get('PORT') ?? 3000);
}
bootstrap();
