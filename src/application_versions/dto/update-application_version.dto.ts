import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationVersionDto } from './create-application_version.dto';

export class UpdateApplicationVersionDto extends PartialType(CreateApplicationVersionDto) {}
