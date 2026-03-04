import { 
  Controller, Get, Post, Body, Param, 
  Delete, UseInterceptors, UploadedFile, Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UserDocumentsService } from './user_documents.service';
import { DocumentType } from './entities/user_document.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('user-documents')
@ApiBearerAuth()
@Controller('user-documents')
export class UserDocumentsController {
  constructor(private readonly userDocumentsService: UserDocumentsService) {}

  // UPLOAD RESUME
  @Post('upload/resume')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { 
    userId: { type: 'string' }, 
    file: { type: 'string', format: 'binary' } 
  } } })
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = ['.pdf', '.docx'];
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      if (allowed.includes(`.${ext}`)) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF and DOCX files are allowed'), false);
      }
    }
  }))
  uploadResume(
    @Body('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userDocumentsService.uploadResume(userId, file);
  }

  // UPLOAD SUPPORTING DOCUMENT
  @Post('upload/document')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { 
    userId: { type: 'string' }, 
    file: { type: 'string', format: 'binary' },
    type: { type: 'string', enum: Object.values(DocumentType) },
    name: { type: 'string' },
    certification_name: { type: 'string' },
    issuing_org: { type: 'string' },
    issue_date: { type: 'string' },
    expiry_date: { type: 'string' },
  } } })
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  uploadDocument(
    @Body('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: {
      type: DocumentType;
      name: string;
      certification_name?: string;
      issuing_org?: string;
      issue_date?: string;
      expiry_date?: string;
    }
  ) {
    return this.userDocumentsService.uploadDocument(userId, file, body);
  }

  // UPLOAD PROFILE PHOTO
  @Post('upload/photo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { 
    userId: { type: 'string' }, 
    image: { type: 'string', format: 'binary' } 
  } } })
  @UseInterceptors(FileInterceptor('image', {
    storage: memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = ['.jpg', '.jpeg', '.png'];
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      if (allowed.includes(`.${ext}`)) {
        cb(null, true);
      } else {
        cb(new Error('Only JPG and PNG images are allowed'), false);
      }
    }
  }))
  uploadPhoto(
    @Body('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userDocumentsService.uploadPhoto(userId, file);
  }

  // GET ALL - admin only - must come before /:userId
  @Get('documents')
  findAll() {
    return this.userDocumentsService.findAll();
  }

  // GET ONE - must come before /:userId to avoid conflict
  @Get('documents/file/:id')
  findOne(@Param('id') id: string) {
    return this.userDocumentsService.findOne(id);
  }

  // GET ALL DOCUMENTS FOR USER - dynamic route last
  @Get('documents/:userId')
  @ApiQuery({ name: 'type', required: false, enum: DocumentType })
  findByUser(
    @Param('userId') userId: string,
    @Query('type') type?: DocumentType,
  ) {
    return this.userDocumentsService.findByUser(userId, type);
  }

  // DELETE
  @Delete('documents/file/:id')
  remove(@Param('id') id: string) {
    return this.userDocumentsService.remove(id);
  }
}