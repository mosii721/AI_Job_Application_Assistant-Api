import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDescriptionDto } from './create-job_description.dto';

export class UpdateJobDescriptionDto extends PartialType(CreateJobDescriptionDto) {}
