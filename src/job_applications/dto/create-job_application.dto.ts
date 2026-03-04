import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsObject, IsOptional, IsString, IsUrl, isURL, ValidateNested } from "class-validator";
import { MasterProfileDto } from "src/master_profiles/dto/create-master_profile.dto";
import { ApplicationStatus, CoverLetterLength, Tone } from "../entities/job_application.entity";
import { ApiProperty } from "@nestjs/swagger";

export class MatchAnalysisDto {
    @IsNumber()
    overall_score: number;

    @IsString()
    match_level: string;

    @IsString({ each: true })
    strengths: string[];

    @IsString({ each: true })
    gaps: string[];

    @IsString({ each: true })
    recommendations: string[];

    @IsString()
    summary: string;
}

export class CoverLetterPreferencesDto {
    @ApiProperty({ description: 'Tone of the cover letter (e.g. professional, enthusiastic, technical, etc.)' })
    @IsEnum(Tone)
    tone: Tone= Tone.PROFESSIONAL; // professional, enthusiastic, technical

    @ApiProperty({ description: 'Length of the cover letter (e.g. short, medium, long)' })
    @IsEnum(CoverLetterLength)
    length: CoverLetterLength = CoverLetterLength.MEDIUM; // short, medium, long

    @ApiProperty({ description: 'Key points or achievements to emphasize in the cover letter' })
    @IsString({ each: true })
    emphasize: string[];
}

export class CreateJobApplicationDto {
    @ApiProperty({ description: 'ID of the job being applied to' })
    @IsString()
    jobId: string;

    @ApiProperty({ description: 'ID of the user applying to the job' })
    @IsString()
    userId: string;

    @ApiProperty({ description: 'Version of the master profile used for tailoring the application' })
    @IsNumber()
    profileVersionUsed: number;

    @ApiProperty({ description: 'Overall match score between the job requirements and the applicant profile' })
    @IsNumber()
    overallMatchScore: number;

    @ApiProperty({ description: 'Detailed analysis of how the applicant skills matches the job requirements' })
    @IsNumber()
    skillScore: number;

    @ApiProperty({ description: 'Detailed analysis of how the applicant experience matches the job requirements' })
    @IsNumber()
    experienceScore: number;

    @ApiProperty({ description: 'Detailed analysis of how the applicant education matches the job requirements' })  
    @IsNumber()
    educationScore: number;

    @ApiProperty({ description: 'Detailed analysis of how the applicant profile matches the job requirements' })
    @IsObject()
    matchAnalysisJson: Record<string, any>;

    @ApiProperty({ description: 'Tailored resume data based on the master profile and job requirements' })
    @IsObject()
    @ValidateNested()
    @Type(() => MasterProfileDto)
    tailoredResumeJson: MasterProfileDto;

    @ApiProperty({ description: 'Current version of the cover letter (if any)' })
    @IsOptional()
    @IsString()
    coverLetterCurrent?: string;

    @ApiProperty({ description: 'Preferences for generating the cover letter' })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CoverLetterPreferencesDto)
    coverLetterPreferencesJson?: CoverLetterPreferencesDto;

    @ApiProperty({ description: 'Current version of the email subject line (if any)' })
    @IsOptional()
    @IsString()
    emailSubject?: string;

    @ApiProperty({ description: 'Current version of the email body (if any)' })
    @IsOptional()
    @IsString()
    emailBody?: string;

    @ApiProperty({ description: 'URL to the tailored resume file (if generated)' })
    @IsOptional()
    @IsUrl()
    resumeFileUrl?: string;

    @ApiProperty({ description: 'URL to the generated cover letter file (if generated)' })
    @IsOptional()
    @IsUrl()
    mergedPackageUrl?: string;

    @ApiProperty({ description: 'Current status of the application' })
    @IsEnum(ApplicationStatus)
    status: ApplicationStatus;

}
