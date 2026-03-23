import { Type } from "class-transformer";
import { IsArray, IsNumber, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";



export class JobDto {
    @ApiProperty({ description: 'URL of the job posting' })
    @IsOptional() 
    @IsString()
    url?: string;

    @ApiProperty({ description: 'Job title' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Company offering the job' })
    @IsString()
    company: string;

    @ApiProperty({ description: 'Location of the job' })
    @IsOptional() 
    @IsString()
    location?: string;

    @ApiProperty({ description: 'Work mode - remote, onsite, hybrid' })
    @IsOptional() 
    @IsString()
    mode?: string;

    @ApiProperty({ description: 'Seniority level - internship, junior, mid, senior, lead, executive' })
    @IsOptional() 
    @IsString()
    seniority?: string;

    @ApiProperty({ description: 'Employment type - full_time, part_time, contract, internship, freelance' })
    @IsOptional() 
    @IsString()
    employment_type?: string;

    @ApiProperty({ description: 'Industry the job belongs to' })
    @IsOptional() 
    @IsString()
    industry?: string;

    @ApiProperty({ description: 'Salary range for the job' })
    @IsOptional()
    salary?: {
        min?: number;
        max?: number;
        currency?: string;
        period?: string;
    };

    @ApiProperty({ description: 'List of required skills with priority (must_have or nice_to_have)' })
    @IsOptional() 
    @IsArray()
    required_skills?: { skill: string; priority: string }[];

    @ApiProperty({ description: 'List of job responsibilities' })
    @IsOptional() 
    @IsArray()
    responsibilities?: string[];

    @ApiProperty({ description: 'List of key qualifications required' })
    @IsOptional() 
    @IsArray()
    key_qualifications?: string[];

    @ApiProperty({ description: 'List of role requirements' })
    @IsOptional() 
    @IsArray()
    requirements?: string[];

    @ApiProperty({ description: 'Number of years of experience required' })
    @IsOptional() 
    @IsNumber()
    required_experience_years?: number;

    @ApiProperty({ description: 'How to apply - email, url, or both' })
    @IsOptional() 
    @IsString()
    application_method?: string;

    @ApiProperty({ description: 'Email address to send applications to' })
    @IsOptional() 
    @IsString()
    application_email?: string;

    @ApiProperty({ description: 'URL to apply for the job' })
    @IsOptional() 
    @IsString()
    application_url?: string;

    @ApiProperty({ description: 'Application deadline' })
    @IsOptional() 
    @IsString()
    deadline?: string;

    @ApiProperty({ description: 'About the company' })
    @IsOptional() 
    @IsString()
    about_company?: string;

    @ApiProperty({ description: 'Size of the company - small, medium, large' })
    @IsOptional() 
    @IsString()
    company_size?: string;

    @ApiProperty({ description: 'Core values of the company' })
    @IsOptional() 
    @IsArray()
    company_values?: string[];

    @ApiProperty({ description: 'Why join this company' })
    @IsOptional() 
    @IsString()
    why_join?: string;

    @ApiProperty({ description: 'Department the role belongs to' })
    @IsOptional() 
    @IsString()
    department?: string;

    @ApiProperty({ description: 'Who the role reports to' })
    @IsOptional() 
    @IsString()
    reporting_to?: string;

    @ApiProperty({ description: 'Work arrangement details' })
    @IsOptional() 
    @IsString()
    work_arrangement?: string;

    @ApiProperty({ description: 'List of benefits offered' })
    @IsOptional() 
    @IsArray()
    benefits?: string[];

    @ApiProperty({ description: 'Payment schedule' })
    @IsOptional() 
    @IsString()
    payment_schedule?: string;

    @ApiProperty({ description: 'Probation period details' })
    @IsOptional() 
    @IsString()
    probation_period?: string;

    @ApiProperty({ description: 'Whether the company is an equal opportunity employer' })
    @IsOptional()
    equal_opportunity?: boolean;

    @ApiProperty({ description: 'Whether visa sponsorship is available' })
    @IsOptional()
    visa_sponsorship?: boolean;

    @ApiProperty({ description: 'Whether relocation support is available' })
    @IsOptional()
    relocation_support?: boolean;

    @ApiProperty({ description: 'Whether the job is publicly listed' })
    @IsOptional()
    is_public?: boolean;
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
