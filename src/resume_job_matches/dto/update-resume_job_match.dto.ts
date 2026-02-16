import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeJobMatchDto } from './create-resume_job_match.dto';

export class UpdateResumeJobMatchDto extends PartialType(CreateResumeJobMatchDto) {}
