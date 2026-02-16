import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobDescriptionsService } from './job_descriptions.service';
import { CreateJobDescriptionDto } from './dto/create-job_description.dto';
import { UpdateJobDescriptionDto } from './dto/update-job_description.dto';

@Controller('job-descriptions')
export class JobDescriptionsController {
  constructor(private readonly jobDescriptionsService: JobDescriptionsService) {}

  @Post()
  create(@Body() createJobDescriptionDto: CreateJobDescriptionDto) {
    return this.jobDescriptionsService.create(createJobDescriptionDto);
  }

  @Get()
  findAll() {
    return this.jobDescriptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobDescriptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDescriptionDto: UpdateJobDescriptionDto) {
    return this.jobDescriptionsService.update(+id, updateJobDescriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobDescriptionsService.remove(+id);
  }
}
