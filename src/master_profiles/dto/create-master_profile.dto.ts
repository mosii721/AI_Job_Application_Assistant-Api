import { IsArray, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ExperienceDto {
    @IsString()
    company: string;

    @IsString()
    job_title: string;

    @IsString()
    start_date: string;

    @IsOptional()
    @IsString()
    end_date?: string;

    @IsString()
    description: string;
}

export class EducationDto {
    @IsString()
    institution: string;

    @IsString()
    degree: string;

    @IsString()
    start_date: string;

    @IsOptional()
    @IsString()
    end_date?: string;
}

export class MasterProfileDto {
    @IsOptional()
    @IsString()
    summary?: string;

    @IsOptional()
    @IsArray()
    skills?: any[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true }) // validates every item in the array against ExperienceDto
    @Type(() => ExperienceDto)
    experience?: ExperienceDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EducationDto)
    education?: EducationDto[];
}



export class CreateMasterProfileDto {
    @IsString()
    userId: string;

    @IsInt()
    version_number: number;

    @ValidateNested()//This tells class-validator to go inside the nested object and validate its properties based on their decorators
    @Type(() => MasterProfileDto) //This tells class-transformer to transform the plain object into an instance of MasterProfileDto
    structured_data_json:MasterProfileDto;

    @IsOptional()
    resume_embedding: Record<string, number[]>;
}
