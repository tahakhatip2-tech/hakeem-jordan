import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Temporarily disabled ValidationPipe due to class-transformer dependency
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  //   transform: true,
  // }));

  app.enableCors({
    origin: [
      'https://hakeem-jordan-five.vercel.app',
      'https://hakeemjordanjo.vercel.app',
      'http://localhost:8080',
      'http://localhost:5173',
      'http://localhost:3000',
      'https://tsunamic-unshameable-maricruz.ngrok-free.dev'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, Bypass-Tunnel-Reminder, ngrok-skip-browser-warning',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();
