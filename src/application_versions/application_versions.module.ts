import { Module } from '@nestjs/common';
import { ApplicationVersionsService } from './application_versions.service';
import { ApplicationVersionsController } from './application_versions.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationVersion } from './entities/application_version.entity';
import { JobApplication } from 'src/job_applications/entities/job_application.entity';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards';

@Module({
  imports:[DatabaseModule,TypeOrmModule.forFeature([ApplicationVersion,JobApplication,User])],
  controllers: [ApplicationVersionsController],
  providers: [ApplicationVersionsService,RolesGuard],
  exports:[ApplicationVersionsService],
})
export class ApplicationVersionsModule {}
