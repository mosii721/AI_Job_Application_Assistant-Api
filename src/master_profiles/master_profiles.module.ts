import { Module } from '@nestjs/common';
import { MasterProfilesService } from './master_profiles.service';
import { MasterProfilesController } from './master_profiles.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterProfile } from './entities/master_profile.entity';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule,HttpModule,TypeOrmModule.forFeature([MasterProfile,User])],
  controllers: [MasterProfilesController],
  providers: [MasterProfilesService,RolesGuard],
  exports:[MasterProfilesService],
})
export class MasterProfilesModule {}
