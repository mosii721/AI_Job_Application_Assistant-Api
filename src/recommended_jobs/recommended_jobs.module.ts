import { Module } from '@nestjs/common';
import { RecommendedJobsService } from './recommended_jobs.service';
import { RecommendedJobsController } from './recommended_jobs.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendedJob } from './entities/recommended_job.entity';
import { User } from 'src/users/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { RolesGuard } from 'src/auth/guards';
import { UserPreference } from 'src/user_preferences/entities/user_preference.entity';
import { HttpModule } from '@nestjs/axios';
import { JobsModule } from 'src/jobs/jobs.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DatabaseModule,HttpModule,JobsModule,TypeOrmModule.forFeature([RecommendedJob,User,Job,UserPreference]),ScheduleModule.forRoot()],
  controllers: [RecommendedJobsController],
  providers: [RecommendedJobsService,RolesGuard],
  exports:[RecommendedJobsService],
})
export class RecommendedJobsModule {}
