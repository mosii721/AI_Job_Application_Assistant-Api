import { PartialType } from '@nestjs/mapped-types';
import { CreateAiSuggesstionDto } from './create-ai_suggesstion.dto';

export class UpdateAiSuggesstionDto extends PartialType(CreateAiSuggesstionDto) {}
