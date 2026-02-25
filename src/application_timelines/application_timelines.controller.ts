import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApplicationTimelinesService } from './application_timelines.service';
import { CreateApplicationTimelineDto } from './dto/create-application_timeline.dto';
import { UpdateApplicationTimelineDto } from './dto/update-application_timeline.dto';

@Controller('application-timelines')
export class ApplicationTimelinesController {
  constructor(private readonly applicationTimelinesService: ApplicationTimelinesService) {}

  @Post()
  create(@Body() createApplicationTimelineDto: CreateApplicationTimelineDto) {
    return this.applicationTimelinesService.create(createApplicationTimelineDto);
  }

  @Get()
  findAll() {
    return this.applicationTimelinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationTimelinesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicationTimelineDto: UpdateApplicationTimelineDto) {
    return this.applicationTimelinesService.update(id, updateApplicationTimelineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationTimelinesService.remove(id);
  }
}
