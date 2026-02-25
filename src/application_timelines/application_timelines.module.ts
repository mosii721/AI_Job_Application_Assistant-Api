import { Module } from '@nestjs/common';
import { ApplicationTimelinesService } from './application_timelines.service';
import { ApplicationTimelinesController } from './application_timelines.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationTimeline } from './entities/application_timeline.entity';
import { JobApplication } from 'src/job_applications/entities/job_application.entity';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([ApplicationTimeline,JobApplication,User])],
  controllers: [ApplicationTimelinesController],
  providers: [ApplicationTimelinesService,RolesGuard],
})
export class ApplicationTimelinesModule {}
