import { Module } from '@nestjs/common';
import { JobApplicationsService } from './job_applications.service';
import { JobApplicationsController } from './job_applications.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from './entities/job_application.entity';
import { User } from 'src/users/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { RolesGuard } from 'src/auth/guards';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([JobApplication,User,Job])],
  controllers: [JobApplicationsController],
  providers: [JobApplicationsService,RolesGuard],
})
export class JobApplicationsModule {}
