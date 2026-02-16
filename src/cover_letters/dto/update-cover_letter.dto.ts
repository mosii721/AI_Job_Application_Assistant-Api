import { PartialType } from '@nestjs/mapped-types';
import { CreateCoverLetterDto } from './create-cover_letter.dto';

export class UpdateCoverLetterDto extends PartialType(CreateCoverLetterDto) {}
