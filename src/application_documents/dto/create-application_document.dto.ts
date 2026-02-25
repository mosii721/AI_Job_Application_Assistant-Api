import { IsInt, IsString } from "class-validator";

export class CreateApplicationDocumentDto {
    @IsString()
    applicationId: string;

    @IsString()
    documentId: string;

    @IsInt()
    displayOrder: number;
}
