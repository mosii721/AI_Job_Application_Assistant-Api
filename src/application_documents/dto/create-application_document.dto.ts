import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateApplicationDocumentDto {
    @ApiProperty({ description: 'ID of the Job application this document belongs to' })
    @IsString()
    @IsOptional()
    applicationId: string;

    @ApiProperty({ description: 'ID of the user document' })
    @IsString()
    documentId: string;

    @ApiProperty({ description: 'Order in which the document should be displayed in the application' })
    @IsInt()
    displayOrder: number;
}
