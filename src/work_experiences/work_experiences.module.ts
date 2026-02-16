import { Module } from '@nestjs/common';
import { WorkExperiencesService } from './work_experiences.service';
import { WorkExperiencesController } from './work_experiences.controller';

@Module({
  controllers: [WorkExperiencesController],
  providers: [WorkExperiencesService],
})
export class WorkExperiencesModule {}
