import { IsEnum, IsString } from "class-validator";
import { ContentType, CreatedBy } from "../entities/application_version.entity";

export class CreateApplicationVersionDto {
    @IsString()
    applicationId: string;

    @IsEnum(ContentType)
    contentType: ContentType;

    @IsString()
    contentData: string;

    @IsEnum(CreatedBy)
    created_by: CreatedBy;

}
