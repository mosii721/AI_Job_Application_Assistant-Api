import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecommendedJobsService } from './recommended_jobs.service';
import { CreateRecommendedJobDto } from './dto/create-recommended_job.dto';
import { UpdateRecommendedJobDto } from './dto/update-recommended_job.dto';

@Controller('recommended-jobs')
export class RecommendedJobsController {
  constructor(private readonly recommendedJobsService: RecommendedJobsService) {}

  @Post()
  create(@Body() createRecommendedJobDto: CreateRecommendedJobDto) {
    return this.recommendedJobsService.create(createRecommendedJobDto);
  }

  @Get()
  findAll() {
    return this.recommendedJobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recommendedJobsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecommendedJobDto: UpdateRecommendedJobDto) {
    return this.recommendedJobsService.update(id, updateRecommendedJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recommendedJobsService.remove(id);
  }
}
