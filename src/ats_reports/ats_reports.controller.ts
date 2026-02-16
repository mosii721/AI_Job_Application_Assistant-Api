import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AtsReportsService } from './ats_reports.service';
import { CreateAtsReportDto } from './dto/create-ats_report.dto';
import { UpdateAtsReportDto } from './dto/update-ats_report.dto';

@Controller('ats-reports')
export class AtsReportsController {
  constructor(private readonly atsReportsService: AtsReportsService) {}

  @Post()
  create(@Body() createAtsReportDto: CreateAtsReportDto) {
    return this.atsReportsService.create(createAtsReportDto);
  }

  @Get()
  findAll() {
    return this.atsReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atsReportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAtsReportDto: UpdateAtsReportDto) {
    return this.atsReportsService.update(+id, updateAtsReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atsReportsService.remove(+id);
  }
}
