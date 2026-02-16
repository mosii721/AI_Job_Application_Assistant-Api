import { Module } from '@nestjs/common';
import { AtsReportsService } from './ats_reports.service';
import { AtsReportsController } from './ats_reports.controller';

@Module({
  controllers: [AtsReportsController],
  providers: [AtsReportsService],
})
export class AtsReportsModule {}
