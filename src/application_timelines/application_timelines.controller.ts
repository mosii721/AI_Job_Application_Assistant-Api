import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApplicationTimelinesService } from './application_timelines.service';
import { EventType } from './entities/application_timeline.entity';

@Controller('applications/:appId/timeline')
export class ApplicationTimelinesController {
  constructor(private readonly applicationTimelinesService: ApplicationTimelinesService) {}

  // GET TIMELINE FOR APPLICATION - optionally filter by event type
  @Get()
  findByApplicationId(
    @Param('appId') appId: string,
    @Query('eventType') eventType?: EventType,
  ) {
    return this.applicationTimelinesService.findByApplicationId(appId, eventType);
  }

  // GET ALL - admin only
  @Get('all')
  findAll() {
    return this.applicationTimelinesService.findAll();
  }

  // GET ONE EVENT
  @Get(':eventId')
  findOne(@Param('appId') appId: string,
  @Param('eventId') eventId: string,
  ) {
    return this.applicationTimelinesService.findOne(appId, eventId);
  }

  
}