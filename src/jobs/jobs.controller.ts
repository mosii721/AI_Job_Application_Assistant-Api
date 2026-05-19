import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SearchJobsDto } from './dto/create-job.dto';

@ApiTags('jobs')
@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // SCRAPE AND CREATE JOB - main endpoint
  @Post('scrape')
  @ApiBody({ schema: { properties: { url: { type: 'string' } } } })
  scrapeAndCreate(@Body('url')  url: string ) {
    return this.jobsService.scrapeAndCreate(url);
  }

  // CHECK DUPLICATE
  @Post('check-duplicate')
  @ApiBody({ schema: { properties: { url: { type: 'string' } } } })
  checkDuplicate(@Body('url') url: string) {
    return this.jobsService.checkDuplicate(url);
  }

  // SEARCH JOBS
  @Post('search')
  @ApiBody({ schema: { properties: { query: { type: 'string' }, filters: { type: 'object', properties: { location: { type: 'string' }, role: { type: 'string' }, mode: { type: 'string' } } } } } })
  search(@Body() searchJobDto:SearchJobsDto) {
    return this.jobsService.search(searchJobDto);
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