import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([Job,User])],
  controllers: [JobsController],
  providers: [JobsService,RolesGuard],
})
export class JobsModule {}
