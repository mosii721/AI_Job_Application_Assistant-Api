import { IsArray, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class ExperienceDto {
    @IsString()
    company: string;

    @IsString()
    role: string;

    @IsOptional() 
    @IsString()
    start_date?: string;

    @IsOptional() 
    @IsString()
    end_date?: string;

    @IsOptional()
    is_current?: boolean;

    @IsOptional() 
    @IsString()
    industry?: string;

    @IsOptional() 
    @IsString()
    location?: string;

    @IsOptional() 
    @IsString()
    employment_type?: string;

    @IsOptional() 
    @IsArray()
    bullets?: string[];

    @IsOptional() 
    @IsNumber()
    duration_months?: number;

    @IsOptional()
    duration_estimated?: boolean;
}

export class EducationDto {
    @IsString()
    institution: string;

    @IsString()
    @IsOptional() 
    degree?: string;

    @IsOptional() 
    @IsString()
    field?: string;

    @IsOptional() 
    @IsNumber()
    graduation_year?: number;

    @IsOptional()
    graduation_year_estimated?: boolean;

    @IsOptional() 
    @IsString()
    grade?: string;

    @IsOptional() 
    @IsArray()
    relevant_coursework?: string[];
}

export class MasterProfileDto {
    @ApiProperty({ description: 'Summary of the Resume ' })
    @IsOptional()
    @IsString()
    summary?: string;

    @ApiProperty({ description: 'List of skills extracted from the resume' })
    @IsOptional()
    @IsArray()
    skills?: any[];

    @ApiProperty({ description: 'List of experience entries extracted from the resume' })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true }) // validates every item in the array against ExperienceDto
    @Type(() => ExperienceDto)
    experience?: ExperienceDto[];

    @ApiProperty({ description: 'List of education entries extracted from the resume' })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EducationDto)
    education?: EducationDto[];

    @IsOptional() 
    @IsArray()
    certifications?: any[];

    @IsOptional() 
    @IsArray()
    projects?: any[];

    @IsOptional() 
    @IsArray()
    languages?: any[];

    @IsOptional() 
    @IsArray()
    volunteer?: any[];

    @IsOptional() 
    @IsArray()
    publications?: any[];

    @IsOptional() 
    @IsArray()
    awards?: any[];

    @IsOptional() 
    @IsArray()
    references?: any[];

    @IsOptional()
    personal?: any;
}



export class CreateMasterProfileDto {
    @ApiProperty({ description: 'ID of the user the master profile belongs to' })
    @IsString()
    userId: string;

    @ApiProperty({ description: 'Version number of the master profile' })
    @IsInt()
    version_number: number;

    @ApiProperty({ description: 'Plain text version of the master profile' })
    @ValidateNested()//This tells class-validator to go inside the nested object and validate its properties based on their decorators
    @Type(() => MasterProfileDto) //This tells class-transformer to transform the plain object into an instance of MasterProfileDto
    structured_data_json:MasterProfileDto;

    @ApiProperty({ description: 'Embedding vector for the master profile' })
    @IsOptional()
    resume_embedding: Record<string, number[]>;
}
