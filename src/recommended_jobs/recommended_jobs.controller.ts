import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { RecommendedJobsService } from './recommended_jobs.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('recommended-jobs')
@ApiBearerAuth()
@Controller('recommendations')
export class RecommendedJobsController {
  constructor(private readonly recommendedJobsService: RecommendedJobsService) {}

  @Post('trigger')
  async triggerCron() {
    await this.recommendedJobsService.fetchAndRecommendJobs();
    return { triggered: true };
  }
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