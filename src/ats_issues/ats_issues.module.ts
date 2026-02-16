import { Module } from '@nestjs/common';
import { AtsIssuesService } from './ats_issues.service';
import { AtsIssuesController } from './ats_issues.controller';

@Module({
  controllers: [AtsIssuesController],
  providers: [AtsIssuesService],
})
export class AtsIssuesModule {}
