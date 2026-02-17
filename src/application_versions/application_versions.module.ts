import { Module } from '@nestjs/common';
import { ApplicationVersionsService } from './application_versions.service';
import { ApplicationVersionsController } from './application_versions.controller';

@Module({
  controllers: [ApplicationVersionsController],
  providers: [ApplicationVersionsService],
})
export class ApplicationVersionsModule {}
