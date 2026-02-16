import { Module } from '@nestjs/common';
import { KeywordResultsService } from './keyword_results.service';
import { KeywordResultsController } from './keyword_results.controller';

@Module({
  controllers: [KeywordResultsController],
  providers: [KeywordResultsService],
})
export class KeywordResultsModule {}
