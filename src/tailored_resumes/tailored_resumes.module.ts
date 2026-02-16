import { Module } from '@nestjs/common';
import { TailoredResumesService } from './tailored_resumes.service';
import { TailoredResumesController } from './tailored_resumes.controller';

@Module({
  controllers: [TailoredResumesController],
  providers: [TailoredResumesService],
})
export class TailoredResumesModule {}
