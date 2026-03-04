import { IsArray, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class ExperienceDto {
    @ApiProperty({ description: 'Name of the company where the experience took place' })
    @IsString()
    company: string;

    @ApiProperty({ description: 'Job title held during the experience' })
    @IsString()
    job_title: string;

    @ApiProperty({ description: 'Start date of the experience' })
    @IsString()
    start_date: string;

    @ApiProperty({ description: 'End date of the experience (if applicable)' })
    @IsOptional()
    @IsString()
    end_date?: string;

    @ApiProperty({ description: 'Description of the experience, including key responsibilities and achievements' })
    @IsString()
    description: string;
}

export class EducationDto {
    @ApiProperty({ description: 'Name of the educational institution' })
    @IsString()
    institution: string;

    @ApiProperty({ description: 'Degree or certification obtained' })
    @IsString()
    degree: string;

    @ApiProperty({ description: 'Start date of the education period' })
    @IsString()
    start_date: string;

    @ApiProperty({ description: 'End date of the education period (if applicable)' })
    @IsOptional()
    @IsString()
    end_date?: string;
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
