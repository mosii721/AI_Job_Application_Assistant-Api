import { Module } from '@nestjs/common';
import { AtsCategoryScoresService } from './ats_category_scores.service';
import { AtsCategoryScoresController } from './ats_category_scores.controller';

@Module({
  controllers: [AtsCategoryScoresController],
  providers: [AtsCategoryScoresService],
})
export class AtsCategoryScoresModule {}
