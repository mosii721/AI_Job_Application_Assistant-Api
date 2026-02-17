import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MasterProfilesModule } from './master_profiles/master_profiles.module';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerMiddleware } from './logger.middleware';
import { AtGuard } from './auth/guards';
import { JobApplicationsModule } from './job_applications/job_applications.module';
import { JobsModule } from './jobs/jobs.module';
import { UserDocumentsModule } from './user_documents/user_documents.module';
import { ApplicationDocumentsModule } from './application_documents/application_documents.module';
import { ApplicationVersionsModule } from './application_versions/application_versions.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
  ThrottlerModule.forRoot({
    throttlers: [{
    ttl: 60000, // Time to live in milliseconds (1 minute)
    limit: 100, // Maximum number of requests within the ttl
    }]
  }),
    UsersModule,
    MasterProfilesModule,  
    DatabaseModule, 
    AuthModule, 
    MailModule, JobApplicationsModule, JobsModule, UserDocumentsModule, ApplicationDocumentsModule, ApplicationVersionsModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerModule, // Apply the throttling guard globally
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes('ai-suggesstions','ats-category-scores','auth','ats-issues','ats-reports','cover-letters','educations','job-descriptions','master-profiles','resumes','resume-job-matches','skills','users','work-experiences');
  }
}
