import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";
import { DocumentType } from "../entities/user_document.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDocumentDto {
    @ApiProperty({ description: 'ID of the user this document belongs to' })
    @IsString()
    userId: string;

    @ApiProperty({ description: 'Name of the document (e.g. "Resume - Jan 2024", "AWS Certification", etc.)' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Type of the document (e.g. resume, certification, etc.)' })
    @IsEnum(DocumentType)
    documentType: DocumentType;

    @ApiProperty({ description: 'URL where the document file is stored (e.g. S3 link, Google Drive link, etc.)' })
    @IsUrl()
    fileUrl: string;

    @ApiProperty({ description: 'Number of pages in the document' })
    @IsNumber()
    pageCount: number;

    @ApiProperty({ description: 'File size of the document in KB' })
    @IsNumber()
    fileSizeKb: number;

    @ApiProperty({ description: 'Name of the certificate (e.g. "AWS Certified Solutions Architect", "Google Cloud Professional Data Engineer", etc.)' })
    @IsOptional()
    @IsString()
    certificateName?: string; // for certifications, optional for resumes

    @ApiProperty({ description: 'Issuing organization of the certificate (e.g. "Amazon Web Services", "Google Cloud", etc.)' })
    @IsOptional()
    @IsString()
    issuingOrg?: string; // for certifications, optional for resumes

    @ApiProperty({ description: 'Date when the certificate was issued (optional for resumes)' })
    @IsOptional()
    @IsString()
    issueDate?: string; // for certifications, optional for resumes

    @ApiProperty({ description: 'Date when the certificate expires (optional for resumes and some certifications)' })
    @IsOptional()
    @IsString()
    expiryDate?: string; // for certifications, optional for resumes
}
