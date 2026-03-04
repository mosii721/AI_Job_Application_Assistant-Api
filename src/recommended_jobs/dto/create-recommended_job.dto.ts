import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateRecommendedJobDto {
    @ApiProperty({ description: 'ID of the user for whom this job recommendation is being created' })
    @IsString()
    userId: string

    @ApiProperty({ description: 'ID of the job being recommended' })
    @IsString()
    jobId: string;

    @ApiProperty({ description: 'Basic match score between the user profile and the job description (0.0 - 1.0)' })
    @IsNumber()
    @Min(0)
    @Max(1)              // your docs say scores are 0.0 - 1.0
    basicMatchScore: number;

    @ApiProperty({ description: 'Whether the job recommendation has been processed (default: false)' })
    @IsBoolean()
    @IsOptional()        // should default to false, not required on creation
    isProcessed: boolean = false;

    @ApiProperty({ description: 'Source of the job data (e.g. LinkedIn, Indeed, company website, etc.)' })
    @IsString()
    @IsOptional()        // what if job was manually scraped, not from an API?
    sourceApi: string;

}
