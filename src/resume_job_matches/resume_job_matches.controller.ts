import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResumeJobMatchesService } from './resume_job_matches.service';
import { CreateResumeJobMatchDto } from './dto/create-resume_job_match.dto';
import { UpdateResumeJobMatchDto } from './dto/update-resume_job_match.dto';

@Controller('resume-job-matches')
export class ResumeJobMatchesController {
  constructor(private readonly resumeJobMatchesService: ResumeJobMatchesService) {}

  @Post()
  create(@Body() createResumeJobMatchDto: CreateResumeJobMatchDto) {
    return this.resumeJobMatchesService.create(createResumeJobMatchDto);
  }

  @Get()
  findAll() {
    return this.resumeJobMatchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumeJobMatchesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeJobMatchDto: UpdateResumeJobMatchDto) {
    return this.resumeJobMatchesService.update(+id, updateResumeJobMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumeJobMatchesService.remove(+id);
  }
}
