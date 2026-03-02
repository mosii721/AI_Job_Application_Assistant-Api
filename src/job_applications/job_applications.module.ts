import { Module } from '@nestjs/common';
import { JobApplicationsService } from './job_applications.service';
import { JobApplicationsController } from './job_applications.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from './entities/job_application.entity';
import { User } from 'src/users/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { RolesGuard } from 'src/auth/guards';
import { MasterProfile } from 'src/master_profiles/entities/master_profile.entity';
import { ApplicationTimeline } from 'src/application_timelines/entities/application_timeline.entity';
import { HttpModule } from '@nestjs/axios';
import { ApplicationVersion } from 'src/application_versions/entities/application_version.entity';
import { SuggestionFeedback } from 'src/suggestion_feedbacks/entities/suggestion_feedback.entity';

@Module({
  imports: [DatabaseModule,HttpModule,TypeOrmModule.forFeature([JobApplication,User,Job,MasterProfile,ApplicationTimeline,ApplicationVersion,SuggestionFeedback])],
  controllers: [JobApplicationsController],
  providers: [JobApplicationsService,RolesGuard],
})
export class JobApplicationsModule {}
