import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationTimelineDto } from './create-application_timeline.dto';

export class UpdateApplicationTimelineDto extends PartialType(CreateApplicationTimelineDto) {}
