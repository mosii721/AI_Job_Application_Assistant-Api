import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import  helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet())
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization,X-Requested-With',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT')

  const config = new DocumentBuilder()
    .setTitle('AI Job Application Assistant API')
    .setDescription('API for AI-powered job application assistance')
    .setVersion('1.0')
    .addTag('auth', 'Authentication Endpoints')
    .addTag('users', 'User Management Endpoints')
    .addTag('user-documents', 'User Document Endpoints')
    .addTag('master-profiles', 'Master Profile Endpoints')
    .addTag('user-preferences', 'User Preferences Endpoints')
    .addTag('jobs', 'Job Endpoints')
    .addTag('job-applications', 'Job Application Endpoints')
    .addTag('application-documents', 'Application Document Endpoints')
    .addTag('application-versions', 'Application Version Endpoints')
    .addTag('application-timelines', 'Application Timeline Endpoints')
    .addTag('recommended-jobs', 'Recommended Jobs Endpoints')
    .addTag('suggestion-feedbacks', 'Suggestion Feedback Endpoints')
    .addBearerAuth()
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
      jsonDocumentUrl: 'api/api-json',
      swaggerOptions: {
          persistAuthorization: true,
          tagsSorter: 'alpha',
          operationsSorter: 'alpha',
          docExpansion: 'none',
          filter: true,
      },
      customCss: `
      .swagger-ui .topbar { display:none; }
      `,
      customSiteTitle: 'AI Job Application Assistant API Docs'
  });
  
  await app.listen(PORT, '0.0.0.0');
  console.log(`Job Application Assistant Api is running on ${PORT}`)
}
bootstrap();
