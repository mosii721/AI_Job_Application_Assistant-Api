import { Module } from '@nestjs/common';
import { ResumeJobMatchesService } from './resume_job_matches.service';
import { ResumeJobMatchesController } from './resume_job_matches.controller';

@Module({
  controllers: [ResumeJobMatchesController],
  providers: [ResumeJobMatchesService],
})
export class ResumeJobMatchesModule {}
