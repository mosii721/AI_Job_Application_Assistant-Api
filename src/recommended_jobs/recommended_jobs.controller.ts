import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { RecommendedJobsService } from './recommended_jobs.service';

@Controller('recommendations')
export class RecommendedJobsController {
  constructor(private readonly recommendedJobsService: RecommendedJobsService) {}

  // GET ALL - admin only
  @Get()
  findAll() {
    return this.recommendedJobsService.findAll();
  }

  // GET RECOMMENDATIONS FOR USER
  @Get(':userId')
  findByUserId(@Param('userId') userId: string) {
    return this.recommendedJobsService.findByUserId(userId);
  }

  // MARK AS PROCESSED
  @Post('process/:userId/:jobId')
  markAsProcessed(
    @Param('userId') userId: string,
    @Param('jobId') jobId: string,
  ) {
    return this.recommendedJobsService.markAsProcessed(userId, jobId);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recommendedJobsService.remove(id);
  }
}