import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ApplicationDocumentsService } from './application_documents.service';
import { CreateApplicationDocumentDto } from './dto/create-application_document.dto';

@Controller('applications/:appId/documents')
export class ApplicationDocumentsController {
  constructor(private readonly applicationDocumentsService: ApplicationDocumentsService) {}

  // ADD DOCUMENT TO APPLICATION
  @Post()
  create(
    @Param('appId') appId: string,
    @Body() createApplicationDocumentDto: CreateApplicationDocumentDto,
  ) {
    return this.applicationDocumentsService.create({
      ...createApplicationDocumentDto,
      applicationId: appId,
    });
  }

  // GET ALL DOCUMENTS FOR APPLICATION
  @Get()
  findByApplicationId(@Param('appId') appId: string) {
    return this.applicationDocumentsService.findByApplicationId(appId);
  }

  // REORDER DOCUMENTS
  @Patch('reorder')
  reorder(
    @Param('appId') appId: string,
    @Body() body: { documentIds: string[] },
  ) {
    return this.applicationDocumentsService.reorder(appId, body.documentIds);
  }

  // GET ALL - admin only
  @Get('all')
  findAll() {
    return this.applicationDocumentsService.findAll();
  }

  // REMOVE DOCUMENT FROM APPLICATION
  @Delete(':documentId')
  remove(
    @Param('appId') appId: string,
    @Param('documentId') documentId: string,
  ) {
    return this.applicationDocumentsService.remove(appId, documentId);
  }
}