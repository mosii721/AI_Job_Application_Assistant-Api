import { Module } from '@nestjs/common';
import { UserPreferencesService } from './user_preferences.service';
import { UserPreferencesController } from './user_preferences.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreference } from './entities/user_preference.entity';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([UserPreference,User])],
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService,RolesGuard],
  exports:[UserPreferencesService],
})
export class UserPreferencesModule {}
