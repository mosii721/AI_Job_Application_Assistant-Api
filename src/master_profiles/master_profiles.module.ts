import { Module } from '@nestjs/common';
import { MasterProfilesService } from './master_profiles.service';
import { MasterProfilesController } from './master_profiles.controller';

@Module({
  controllers: [MasterProfilesController],
  providers: [MasterProfilesService],
})
export class MasterProfilesModule {}
