import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApplicationTimelinesService } from './application_timelines.service';
import { EventType } from './entities/application_timeline.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('application-timelines')
@ApiBearerAuth()
@Controller('applications/:appId/timeline')
export class ApplicationTimelinesController {
  constructor(private readonly applicationTimelinesService: ApplicationTimelinesService) {}

  // GET TIMELINE FOR APPLICATION - optionally filter by event type
  @ApiQuery({ name: 'eventType', required: false, enum: EventType })
  @Get()
  findByApplicationId(
    @Param('appId') appId: string,
    @Query('eventType') eventType?: EventType,
  ) {
    return this.applicationTimelinesService.findByApplicationId(appId, eventType);
  }

  // GET ONE EVENT
  @Get(':eventId')
  findOne(@Param('appId') appId: string,
  @Param('eventId') eventId: string,
  ) {
    return this.applicationTimelinesService.findOne(appId, eventId);
  }

  
}