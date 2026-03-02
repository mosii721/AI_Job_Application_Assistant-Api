import { IsEnum, IsOptional, IsString } from "class-validator";
import { SuggestionAction, SuggestionContentType } from "../entities/suggestion_feedback.entity";

export class CreateSuggestionFeedbackDto {
    @IsString()
    userId: string;

    @IsString()
    @IsOptional()
    applicationId?: string;      // optional per API spec

    @IsEnum(SuggestionContentType)
    contentType: SuggestionContentType;

    @IsString()
    @IsOptional()
    originalContent?: string;    // optional per API spec

    @IsString()
    @IsOptional()
    suggestedContent?: string;   // optional per API spec

    @IsEnum(SuggestionAction)
    action: SuggestionAction;
}
