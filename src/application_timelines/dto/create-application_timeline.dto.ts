import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApplicationStatus, EventType } from "../entities/application_timeline.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateApplicationTimelineDto {
    @ApiProperty({ description: 'ID of the Job application this timeline event belongs to' })
    @IsString()
    applicationId: string;

    @ApiProperty({ description: 'Type of event (e.g. status change, AI suggestion, user action, etc.)' })
    @IsEnum(EventType)
    eventType: EventType;

    @ApiProperty({ description: 'Previous status of the application (if event is a status change)' })
    @IsEnum(ApplicationStatus)
    previousStatus: ApplicationStatus;

    @ApiProperty({ description: 'New status of the application (if event is a status change)' })
    @IsEnum(ApplicationStatus)
    newStatus: ApplicationStatus;

    @ApiProperty({ description: 'Additional notes or details about the event' })
    @IsOptional()
    @IsString()
    notes?: string;
}
