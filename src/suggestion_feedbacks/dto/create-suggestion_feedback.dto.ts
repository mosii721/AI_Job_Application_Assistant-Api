import { IsEnum, IsOptional, IsString } from "class-validator";
import { SuggestionAction, SuggestionContentType } from "../entities/suggestion_feedback.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSuggestionFeedbackDto {
    @ApiProperty({ description: 'ID of the user providing feedback on the AI suggestion' })
    @IsString()
    userId: string;

    @ApiProperty({ description: 'ID of the Job application this feedback is associated with (optional if feedback is not tied to a specific application)' })
    @IsString()
    @IsOptional()
    applicationId?: string;      // optional per API spec

    @ApiProperty({ description: 'Type of content the feedback is about (e.g. cover letter, email, resume bullet, etc.)' })
    @IsEnum(SuggestionContentType)
    contentType: SuggestionContentType;

    @ApiProperty({ description: 'Original content before the AI suggestion (optional, but helpful for context)' })
    @IsString()
    @IsOptional()
    originalContent?: string;    // optional per API spec

    @ApiProperty({ description: 'The AI-suggested content that the user is providing feedback on (optional, but helpful for context)' })
    @IsString()
    @IsOptional()
    suggestedContent?: string;   // optional per API spec

    @ApiProperty({ description: 'The action taken by the user (e.g. accept, reject, modify)' })
    @IsEnum(SuggestionAction)
    action: SuggestionAction;
}
