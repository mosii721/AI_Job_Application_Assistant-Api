import { Module } from '@nestjs/common';
import { SuggestionFeedbacksService } from './suggestion_feedbacks.service';
import { SuggestionFeedbacksController } from './suggestion_feedbacks.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuggestionFeedback } from './entities/suggestion_feedback.entity';
import { User } from 'src/users/entities/user.entity';
import { JobApplication } from 'src/job_applications/entities/job_application.entity';
import { RolesGuard } from 'src/auth/guards';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([SuggestionFeedback,User,JobApplication])],
  controllers: [SuggestionFeedbacksController],
  providers: [SuggestionFeedbacksService,RolesGuard],
})
export class SuggestionFeedbacksModule {}
