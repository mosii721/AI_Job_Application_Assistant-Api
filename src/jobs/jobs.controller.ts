import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // SCRAPE AND CREATE JOB - main endpoint
  @Post('scrape')
  scrapeAndCreate(@Body() body: { url: string }) {
    return this.jobsService.scrapeAndCreate(body.url);
  }

  // CHECK DUPLICATE
  @Post('check-duplicate')
  checkDuplicate(@Body() body: { url: string }) {
    return this.jobsService.checkDuplicate(body.url);
  }

  // SEARCH JOBS
  @Post('search')
  search(@Body() body: {
    query?: string;
    filters?: {
      location?: string;
      role?: string;
      mode?: string;
    };
  }) {
    return this.jobsService.search(body);
  }

  // GET ALL - admin only
  @Get()
  findAll(
    @Query('title') title?: string,
    @Query('company') company?: string,
    @Query('location') location?: string,
  ) {
    return this.jobsService.findAll(title, company, location);
  }

  // GET ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  // UPDATE - backend only
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}