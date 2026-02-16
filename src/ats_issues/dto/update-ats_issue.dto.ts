import { PartialType } from '@nestjs/mapped-types';
import { CreateAtsIssueDto } from './create-ats_issue.dto';

export class UpdateAtsIssueDto extends PartialType(CreateAtsIssueDto) {}
