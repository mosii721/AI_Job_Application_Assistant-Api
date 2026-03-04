import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApplicationVersionsService } from './application_versions.service';
import { ContentType } from './entities/application_version.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('application-versions')
@ApiBearerAuth()
@Controller('applications/:appId/versions')
export class ApplicationVersionsController {
  constructor(private readonly applicationVersionsService: ApplicationVersionsService) {}

  @ApiQuery({ name: 'contentType', required: false, enum: ContentType })
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