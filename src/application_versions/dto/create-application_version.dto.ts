import { IsEnum, IsString } from "class-validator";
import { ContentType, CreatedBy } from "../entities/application_version.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateApplicationVersionDto {
    @ApiProperty({ description: 'ID of the Job application this version belongs to' })
    @IsString()
    applicationId: string;

    @ApiProperty({ description: 'Type of content (e.g. cover letter, email, resume bullet, etc.)' })
    @IsEnum(ContentType)
    contentType: ContentType;

    @ApiProperty({ description: 'The actual content data (e.g. text of the cover letter, email, or resume bullet)' })
    @IsString()
    contentData: string;

    @ApiProperty({ description: 'Who created this version (e.g. AI, User, etc.)' })
    @IsEnum(CreatedBy)
    created_by: CreatedBy;

}
