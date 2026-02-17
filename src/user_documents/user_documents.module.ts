import { Module } from '@nestjs/common';
import { UserDocumentsService } from './user_documents.service';
import { UserDocumentsController } from './user_documents.controller';

@Module({
  controllers: [UserDocumentsController],
  providers: [UserDocumentsService],
})
export class UserDocumentsModule {}
