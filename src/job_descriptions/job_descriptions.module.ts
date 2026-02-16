import { Module } from '@nestjs/common';
import { JobDescriptionsService } from './job_descriptions.service';
import { JobDescriptionsController } from './job_descriptions.controller';

@Module({
  controllers: [JobDescriptionsController],
  providers: [JobDescriptionsService],
})
export class JobDescriptionsModule {}
