import { Module } from '@nestjs/common';
import { CoverLettersService } from './cover_letters.service';
import { CoverLettersController } from './cover_letters.controller';

@Module({
  controllers: [CoverLettersController],
  providers: [CoverLettersService],
})
export class CoverLettersModule {}
