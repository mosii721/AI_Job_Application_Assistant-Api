import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateRecommendedJobDto {
    @IsString()
    userId: string

    @IsString()
    jobId: string;

    @IsNumber()
    @Min(0)
    @Max(1)              // your docs say scores are 0.0 - 1.0
    basicMatchScore: number;

    @IsBoolean()
    @IsOptional()        // should default to false, not required on creation
    isProcessed: boolean = false;

    @IsString()
    @IsOptional()        // what if job was manually scraped, not from an API?
    sourceApi: string;

}
