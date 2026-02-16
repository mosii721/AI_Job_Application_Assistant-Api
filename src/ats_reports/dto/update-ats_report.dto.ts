import { PartialType } from '@nestjs/mapped-types';
import { CreateAtsReportDto } from './create-ats_report.dto';

export class UpdateAtsReportDto extends PartialType(CreateAtsReportDto) {}
