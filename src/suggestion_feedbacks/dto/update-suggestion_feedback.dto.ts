import { PartialType } from '@nestjs/mapped-types';
import { CreateSuggestionFeedbackDto } from './create-suggestion_feedback.dto';

export class UpdateSuggestionFeedbackDto extends PartialType(CreateSuggestionFeedbackDto) {}
