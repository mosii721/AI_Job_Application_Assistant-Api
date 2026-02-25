import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApplicationStatus, EventType } from "../entities/application_timeline.entity";

export class CreateApplicationTimelineDto {
    @IsString()
    applicationId: string;

    @IsEnum(EventType)
    eventType: EventType;

    @IsEnum(ApplicationStatus)
    previousStatus: ApplicationStatus;

    @IsEnum(ApplicationStatus)
    newStatus: ApplicationStatus;

    @IsOptional()
    @IsString()
    notes?: string;
}
