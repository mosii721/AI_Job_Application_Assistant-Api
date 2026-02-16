import { PartialType } from '@nestjs/mapped-types';
import { CreateAtsCategoryScoreDto } from './create-ats_category_score.dto';

export class UpdateAtsCategoryScoreDto extends PartialType(CreateAtsCategoryScoreDto) {}
