import { PartialType } from '@nestjs/mapped-types';
import { CreateTailoredResumeDto } from './create-tailored_resume.dto';

export class UpdateTailoredResumeDto extends PartialType(CreateTailoredResumeDto) {}
