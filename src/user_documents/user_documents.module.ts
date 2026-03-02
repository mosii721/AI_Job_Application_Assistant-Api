import { Module } from '@nestjs/common';
import { UserDocumentsService } from './user_documents.service';
import { UserDocumentsController } from './user_documents.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDocument } from './entities/user_document.entity';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards';
import { MasterProfilesModule } from 'src/master_profiles/master_profiles.module';

@Module({
  imports: [DatabaseModule,MasterProfilesModule,TypeOrmModule.forFeature([UserDocument,User])],
  controllers: [UserDocumentsController],
  providers: [UserDocumentsService,RolesGuard],
})
export class UserDocumentsModule {}
