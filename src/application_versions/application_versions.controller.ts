import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApplicationVersionsService } from './application_versions.service';
import { ContentType } from './entities/application_version.entity';

@Controller('applications/:appId/versions')
export class ApplicationVersionsController {
  constructor(private readonly applicationVersionsService: ApplicationVersionsService) {}

  @Get('all')
  findAll() {
    return this.applicationVersionsService.findAll();
  }

  @Get()
  findByApplicationId(
    @Param('appId') appId: string,
    @Query('contentType') contentType?: ContentType,
  ) {
    return this.applicationVersionsService.findByApplicationId(appId, contentType);
  }

  @Get('cover-letter')
  findCoverLetterVersions(@Param('appId') appId: string) {
    return this.applicationVersionsService.findCoverLetterVersions(appId);
  }

  @Get('email')
  findEmailVersions(@Param('appId') appId: string) {
    return this.applicationVersionsService.findEmailVersions(appId);
  }

  @Get('resume-bullet')
  findResumeBulletVersions(@Param('appId') appId: string) {
    return this.applicationVersionsService.findResumeBulletVersions(appId);
  }

  @Get(':versionId')
  findOne(@Param('versionId') versionId: string) {
    return this.applicationVersionsService.findOne(versionId);
  }
}