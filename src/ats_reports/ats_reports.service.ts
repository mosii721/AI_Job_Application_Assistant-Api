import { Injectable } from '@nestjs/common';
import { CreateAtsReportDto } from './dto/create-ats_report.dto';
import { UpdateAtsReportDto } from './dto/update-ats_report.dto';

@Injectable()
export class AtsReportsService {
  create(createAtsReportDto: CreateAtsReportDto) {
    return 'This action adds a new atsReport';
  }

  findAll() {
    return `This action returns all atsReports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} atsReport`;
  }

  update(id: number, updateAtsReportDto: UpdateAtsReportDto) {
    return `This action updates a #${id} atsReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} atsReport`;
  }
}
