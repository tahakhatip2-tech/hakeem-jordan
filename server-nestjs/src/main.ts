import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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
      'https://hakeem-jordan-jordan.vercel.app',
      'https://hakeemjordanjo.vercel.app',
      'https://hakeem-jordan-five.vercel.app',
      'http://localhost:8080',
      'http://localhost:5173',
      'http://localhost:3000',
      'https://tsunamic-unshameable-maricruz.ngrok-free.dev',
      'https://hakeem-jordan-jordan.vercel.app/'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, Bypass-Tunnel-Reminder, ngrok-skip-browser-warning',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Hakeem Jordan API')
    .setDescription(`
      # نظام إدارة العيادات الذكي - Hakeem Jordan API
      
      ## 🏥 نظرة عامة
      API شامل لإدارة العيادات الطبية مع تكامل الذكاء الاصطناعي وواتساب.
      
      ## 🔐 المصادقة
      جميع الـ Endpoints المحمية تحتاج إلى JWT Token في الـ Header:
      \`\`\`
      Authorization: Bearer <your-token>
      \`\`\`
      
      ## 📱 المميزات الرئيسية
      - **إدارة المواعيد**: حجز، تعديل، إلغاء المواعيد
      - **إدارة المرضى**: ملفات طبية، وصفات، تاريخ مرضي
      - **واتساب AI**: سكرتير آلي ذكي للرد على الرسائل
      - **التقارير**: إحصائيات وتقارير مالية
      
      ## 🌐 Base URL
      - **Production**: https://your-domain.com/api
      - **Development**: http://localhost:3000/api
    `)
    .setVersion('1.0')
    .addTag('Auth', 'نقاط الدخول للمصادقة والتسجيل')
    .addTag('Appointments', 'إدارة المواعيد والحجوزات')
    .addTag('Contacts', 'إدارة المرضى وجهات الاتصال')
    .addTag('WhatsApp', 'تكامل واتساب والرسائل')
    .addTag('Notifications', 'إدارة الإشعارات')
    .addTag('Groups', 'إدارة المجموعات')
    .addTag('Subscriptions', 'إدارة الاشتراكات والباقات')
    .addTag('Extractor', 'استخراج البيانات من المنصات')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'أدخل JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://your-production-url.com', 'Production Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Hakeem Jordan API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { color: #1976d2 }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
  logger.log(`📚 API Documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap();
