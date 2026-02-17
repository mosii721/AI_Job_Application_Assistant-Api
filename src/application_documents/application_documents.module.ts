import { Module } from '@nestjs/common';
import { ApplicationDocumentsService } from './application_documents.service';
import { ApplicationDocumentsController } from './application_documents.controller';

@Module({
  controllers: [ApplicationDocumentsController],
  providers: [ApplicationDocumentsService],
})
export class ApplicationDocumentsModule {}
