import { Module } from '@nestjs/common';
import { AiSuggesstionsService } from './ai_suggesstions.service';
import { AiSuggesstionsController } from './ai_suggesstions.controller';

@Module({
  controllers: [AiSuggesstionsController],
  providers: [AiSuggesstionsService],
})
export class AiSuggesstionsModule {}
