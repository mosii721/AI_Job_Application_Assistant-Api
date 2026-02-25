import { PartialType } from '@nestjs/mapped-types';
import { CreateRecommendedJobDto } from './create-recommended_job.dto';

export class UpdateRecommendedJobDto extends PartialType(CreateRecommendedJobDto) {}
