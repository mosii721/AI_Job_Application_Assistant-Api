import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";
import { DocumentType } from "../entities/user_document.entity";

export class CreateUserDocumentDto {
    @IsString()
    userId: string;

    @IsString()
    name: string;

    @IsEnum(DocumentType)
    documentType: DocumentType;

    @IsUrl()
    fileUrl: string;

    @IsNumber()
    pageCount: number;

    @IsNumber()
    fileSizeKb: number;

    @IsOptional()
    @IsString()
    certificateName?: string; // for certifications, optional for resumes

    @IsOptional()
    @IsString()
    issuingOrg?: string; // for certifications, optional for resumes

    @IsOptional()
    @IsString()
    issueDate?: string; // for certifications, optional for resumes

    @IsOptional()
    @IsString()
    expiryDate?: string; // for certifications, optional for resumes
}
