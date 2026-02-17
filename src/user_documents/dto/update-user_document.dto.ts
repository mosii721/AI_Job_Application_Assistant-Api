import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDocumentDto } from './create-user_document.dto';

export class UpdateUserDocumentDto extends PartialType(CreateUserDocumentDto) {}
