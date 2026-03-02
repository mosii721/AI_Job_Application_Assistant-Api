import { Module } from '@nestjs/common';
import { ApplicationDocumentsService } from './application_documents.service';
import { ApplicationDocumentsController } from './application_documents.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationDocument } from './entities/application_document.entity';
import { JobApplication } from 'src/job_applications/entities/job_application.entity';
import { UserDocument } from 'src/user_documents/entities/user_document.entity';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([ApplicationDocument,JobApplication,UserDocument,User])],
  controllers: [ApplicationDocumentsController],
  providers: [ApplicationDocumentsService,RolesGuard],
  exports:[ApplicationDocumentsService],
})
export class ApplicationDocumentsModule {}
