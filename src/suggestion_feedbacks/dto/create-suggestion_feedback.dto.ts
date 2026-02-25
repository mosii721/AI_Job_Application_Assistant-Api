import { IsEnum, IsOptional, IsString } from "class-validator";
import { ContentType, SuggestionAction } from "../entities/suggestion_feedback.entity";

export class CreateSuggestionFeedbackDto {
    @IsString()
    userId: string;

    @IsString()
    @IsOptional()
    applicationId?: string;      // optional per API spec

    @IsEnum(ContentType)
    contentType: ContentType;

    @IsString()
    @IsOptional()
    originalContent?: string;    // optional per API spec

    @IsString()
    @IsOptional()
    suggestedContent?: string;   // optional per API spec

    @IsEnum(SuggestionAction)
    action: SuggestionAction;
}
