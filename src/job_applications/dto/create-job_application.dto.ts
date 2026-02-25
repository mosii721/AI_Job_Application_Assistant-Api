import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsObject, IsOptional, IsString, IsUrl, isURL, ValidateNested } from "class-validator";
import { MasterProfileDto } from "src/master_profiles/dto/create-master_profile.dto";
import { ApplicationStatus, CoverLetterLength, Tone } from "../entities/job_application.entity";

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
    @IsEnum(Tone)
    tone: Tone= Tone.PROFESSIONAL; // professional, enthusiastic, technical

    @IsEnum(CoverLetterLength)
    length: CoverLetterLength = CoverLetterLength.MEDIUM; // short, medium, long

    @IsString({ each: true })
    emphasize: string[];
}

export class CreateJobApplicationDto {
    @IsString()
    jobId: string;

    @IsString()
    userId: string;

    @IsNumber()
    profileVersionUsed: number;

    @IsNumber()
    overallMatchScore: number;

    @IsNumber()
    skillScore: number;

    @IsNumber()
    experienceScore: number;

    @IsNumber()
    educationScore: number;

    @IsObject()
    @ValidateNested()
    @Type(() => MatchAnalysisDto)
    matchAnalysisJson: MatchAnalysisDto;

    @IsObject()
    @ValidateNested()
    @Type(() => MasterProfileDto)
    tailoredResumeJson: MasterProfileDto;

    @IsOptional()
    @IsString()
    coverLetterCurrent?: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CoverLetterPreferencesDto)
    coverLetterPreferencesJson?: CoverLetterPreferencesDto;

    @IsOptional()
    @IsString()
    emailSubject?: string;

    @IsOptional()
    @IsString()
    emailBody?: string;

    @IsOptional()
    @IsUrl()
    resumeFileUrl?: string;

    @IsOptional()
    @IsUrl()
    mergedPackageUrl?: string;

    @IsEnum(ApplicationStatus)
    status: ApplicationStatus;

}
