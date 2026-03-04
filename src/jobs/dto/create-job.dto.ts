import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { ApplicationMethod, JobType, Seniority, WorkMode } from "../entities/job.entity";
import { ApiProperty } from "@nestjs/swagger";



export class JobDto {
    @ApiProperty({ description: 'Job title' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Company offering the job' })
    @IsString()
    company: string;

    @ApiProperty({ description: 'Location of the job' })
    @IsString()
    location: string;

    @ApiProperty({ description: 'Seniority level required for the job (e.g. junior, mid, senior)' })
    @IsEnum(Seniority)
    seniority: Seniority;

    @ApiProperty({ description: 'Work mode for the job (e.g. remote, onsite, hybrid)' })
    @IsEnum(WorkMode)
    mode: WorkMode; // remote, onsite, hybrid

    @ApiProperty({ description: 'Type of job (e.g. full-time, part-time, contract, internship, freelance)' })
    @IsEnum(JobType)
    job_type: JobType; // full_time, part_time, contract, internship, freelance

    @ApiProperty({ description: 'List of required skills for the job' })
    @IsArray()
    @IsString({ each: true })
    required_skills: string[];

    @ApiProperty({ description: 'List of job responsibilities' })
    @IsArray()
    @IsString({ each: true })
    responsibilities: string[];

    @ApiProperty({ description: 'Application method for the job (e.g. email, portal, both)' })
    @IsEnum(ApplicationMethod)
    application_method: ApplicationMethod; // email, portal, both

    @ApiProperty({ description: 'If application method includes email, the email address to send applications to' })
    @IsOptional()
    @IsString()
    application_email?: string;

    @ApiProperty({ description: 'Deadline for the job application (if any)' })
    @IsOptional()
    @IsString()
    deadline?: string;

    @ApiProperty({ description: 'Number of years of experience required for the job (if specified)' })
    @IsOptional()
    @IsNumber()
    required_experience_years?: number;
}

export class CreateJobDto {
    @ApiProperty({ description: 'Job title' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Company offering the job' })
    @IsString()
    company: string;

    @ApiProperty({ description: 'Location of the job' })
    @IsString()
    location: string;

    @ApiProperty({ description: 'Plain scraped text from a job posting' })
    @IsString()
    raw_description: string; // plain scraped text, always a string

    @ApiProperty({ description: 'AI-structured version of the job description' })
    @ValidateNested()
    @Type(() => JobDto)
    structured_job_json: JobDto; // AI-structured version of raw_description

    @ApiProperty({ description: 'Embedding vector for the job description' })   
    @IsObject()
    job_embedding: Record<string, number[]>;

    @ApiProperty({ description: 'Source URL of the job posting' })
    @IsUrl()
    source_url: string;

    @ApiProperty({ description: 'Hash of the source URL for deduplication' })
    @IsString()
    url_hash: string;
}
