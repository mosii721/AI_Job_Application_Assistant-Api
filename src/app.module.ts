import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MasterProfilesModule } from './master_profiles/master_profiles.module';
import { ResumesModule } from './resumes/resumes.module';
import { JobDescriptionsModule } from './job_descriptions/job_descriptions.module';
import { SkillsModule } from './skills/skills.module';
import { WorkExperiencesModule } from './work_experiences/work_experiences.module';
import { EducationsModule } from './educations/educations.module';
import { AtsReportsModule } from './ats_reports/ats_reports.module';
import { ResumeJobMatchesModule } from './resume_job_matches/resume_job_matches.module';
import { TailoredResumesModule } from './tailored_resumes/tailored_resumes.module';
import { CoverLettersModule } from './cover_letters/cover_letters.module';
import { AtsCategoryScoresModule } from './ats_category_scores/ats_category_scores.module';
import { AtsIssuesModule } from './ats_issues/ats_issues.module';
import { KeywordResultsModule } from './keyword_results/keyword_results.module';
import { AiSuggesstionsModule } from './ai_suggesstions/ai_suggesstions.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerMiddleware } from './logger.middleware';
import { AtGuard } from './auth/guards';

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
    ResumesModule,
    JobDescriptionsModule, 
    SkillsModule, 
    WorkExperiencesModule, 
    EducationsModule, 
    AtsReportsModule, 
    ResumeJobMatchesModule, 
    TailoredResumesModule, 
    CoverLettersModule, 
    AtsCategoryScoresModule, 
    AtsIssuesModule, 
    KeywordResultsModule, 
    AiSuggesstionsModule, 
    DatabaseModule, 
    AuthModule, 
    MailModule],
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
