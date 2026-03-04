import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ExperienceLevel, JobType } from "../entities/user_preference.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserPreferenceDto {
    @ApiProperty({ description: 'ID of the user these preferences belong to' })
    @IsString()
    userId: string;

    @ApiProperty({ description: 'List of preferred job roles (e.g. Software Engineer, Data Scientist, Product Manager, etc.)' })
    @IsArray()
    @IsString({ each: true })    // validates each item in array
    preferredRoles: string[];

    @ApiProperty({ description: 'List of preferred industries (e.g. Technology, Finance, Healthcare, etc.)' })
    @IsArray()
    @IsString({ each: true })    // validates each item in array
    industries: string[];

    @ApiProperty({ description: 'Preferred experience level (e.g. Entry, Mid, Senior, etc.)' })
    @IsEnum(ExperienceLevel)
    experienceLevel: ExperienceLevel;

    @ApiProperty({ description: 'Preferred job locations (e.g. New York, San Francisco, Remote, etc.)' })
    @IsArray()
    @IsString({ each: true })
    locationPreference: string[];

    @ApiProperty({ description: 'Preferred job types (e.g. Full-time, Part-time, Contract, Internship, Freelance)' })
    @IsArray()
    @IsEnum(JobType, { each: true })
    jobType: JobType[];

    @ApiProperty({ description: 'Minimum salary expectation (optional)' })
    @IsOptional()
    @IsNumber()
    salaryMin?: number;

    @ApiProperty({ description: 'Maximum salary expectation (optional)' })
    @IsOptional()
    @IsNumber()
    salaryMax?: number;

    @ApiProperty({ description: 'Currency for the salary expectations (e.g. USD, EUR, GBP, etc.)' })
    @IsOptional()
    @IsString()
    salaryCurrency?: string;
}
