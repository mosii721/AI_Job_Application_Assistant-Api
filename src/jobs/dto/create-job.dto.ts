import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { ApplicationMethod, JobType, Seniority, WorkMode } from "../entities/job.entity";



export class JobDto {
    @IsString()
    title: string;

    @IsString()
    company: string;

    @IsString()
    location: string;

    @IsEnum(Seniority)
    seniority: Seniority;

    @IsEnum(WorkMode)
    mode: WorkMode; // remote, onsite, hybrid

    @IsEnum(JobType)
    job_type: JobType; // full_time, part_time, contract, internship, freelance

    @IsArray()
    @IsString({ each: true })
    required_skills: string[];

    @IsArray()
    @IsString({ each: true })
    responsibilities: string[];

    @IsEnum(ApplicationMethod)
    application_method: ApplicationMethod; // email, portal, both

    @IsOptional()
    @IsString()
    application_email?: string;

    @IsOptional()
    @IsString()
    deadline?: string;

    @IsOptional()
    @IsNumber()
    required_experience_years?: number;
}

export class CreateJobDto {
    @IsString()
    title: string;

    @IsString()
    company: string;

    @IsString()
    location: string;

    @IsString()
    raw_description: string; // plain scraped text, always a string

    @ValidateNested()
    @Type(() => JobDto)
    structured_job_json: JobDto; // AI-structured version of raw_description

    @IsArray()
    @IsNumber({}, { each: true })
    job_embedding: number[];

    @IsUrl()
    source_url: string;

    @IsString()
    url_hash: string;
}
