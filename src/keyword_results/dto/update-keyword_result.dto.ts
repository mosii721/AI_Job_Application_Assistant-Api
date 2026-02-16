import { PartialType } from '@nestjs/mapped-types';
import { CreateKeywordResultDto } from './create-keyword_result.dto';

export class UpdateKeywordResultDto extends PartialType(CreateKeywordResultDto) {}
