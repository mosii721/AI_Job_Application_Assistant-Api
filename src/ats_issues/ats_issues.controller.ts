import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AtsIssuesService } from './ats_issues.service';
import { CreateAtsIssueDto } from './dto/create-ats_issue.dto';
import { UpdateAtsIssueDto } from './dto/update-ats_issue.dto';

@Controller('ats-issues')
export class AtsIssuesController {
  constructor(private readonly atsIssuesService: AtsIssuesService) {}

  @Post()
  create(@Body() createAtsIssueDto: CreateAtsIssueDto) {
    return this.atsIssuesService.create(createAtsIssueDto);
  }

  @Get()
  findAll() {
    return this.atsIssuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atsIssuesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAtsIssueDto: UpdateAtsIssueDto) {
    return this.atsIssuesService.update(+id, updateAtsIssueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atsIssuesService.remove(+id);
  }
}
