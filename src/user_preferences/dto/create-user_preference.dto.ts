import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ExperienceLevel, JobType } from "../entities/user_preference.entity";

export class CreateUserPreferenceDto {
    @IsString()
    userId: string;

    @IsArray()
    @IsString({ each: true })    // validates each item in array
    preferredRoles: string[];

    @IsArray()
    @IsString({ each: true })    // validates each item in array
    industries: string[];

    @IsEnum(ExperienceLevel)
    experienceLevel: ExperienceLevel;

    @IsArray()
    @IsString({ each: true })
    locationPreference: string[];

    @IsArray()
    @IsEnum(JobType, { each: true })
    jobType: JobType[];

    @IsOptional()
    @IsNumber()
    salaryMin?: number;

    @IsOptional()
    @IsNumber()
    salaryMax?: number;

    @IsOptional()
    @IsString()
    salaryCurrency?: string;
}
