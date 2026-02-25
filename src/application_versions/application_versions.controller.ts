import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApplicationVersionsService } from './application_versions.service';
import { CreateApplicationVersionDto } from './dto/create-application_version.dto';
import { UpdateApplicationVersionDto } from './dto/update-application_version.dto';

@Controller('application-versions')
export class ApplicationVersionsController {
  constructor(private readonly applicationVersionsService: ApplicationVersionsService) {}

  @Post()
  create(@Body() createApplicationVersionDto: CreateApplicationVersionDto) {
    return this.applicationVersionsService.create(createApplicationVersionDto);
  }

  @Get()
  findAll() {
    return this.applicationVersionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationVersionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicationVersionDto: UpdateApplicationVersionDto) {
    return this.applicationVersionsService.update(id, updateApplicationVersionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationVersionsService.remove(id);
  }
}
