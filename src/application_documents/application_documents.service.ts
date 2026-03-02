import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDocumentDto } from './dto/create-application_document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationDocument } from './entities/application_document.entity';
import { Repository } from 'typeorm';
import { JobApplication } from 'src/job_applications/entities/job_application.entity';
import { UserDocument } from 'src/user_documents/entities/user_document.entity';

@Injectable()
export class ApplicationDocumentsService {
  constructor(
    @InjectRepository(ApplicationDocument) 
    private readonly applicationDocumentRepository: Repository<ApplicationDocument>,
    @InjectRepository(JobApplication) 
    private readonly jobApplicationRepository: Repository<JobApplication>,
    @InjectRepository(UserDocument) 
    private readonly userDocumentRepository: Repository<UserDocument>,
  ) {}

  // ADD DOCUMENT TO APPLICATION
  async create(createApplicationDocumentDto: CreateApplicationDocumentDto) {
    const existApplication = await this.jobApplicationRepository.findOneBy({ 
      id: createApplicationDocumentDto.applicationId 
    });
    if (!existApplication) {
      throw new NotFoundException(`Application with id ${createApplicationDocumentDto.applicationId} not found`);
    }

    const existDocument = await this.userDocumentRepository.findOneBy({ 
      id: createApplicationDocumentDto.documentId 
    });
    if (!existDocument) {
      throw new NotFoundException(`Document with id ${createApplicationDocumentDto.documentId} not found`);
    }

    // check if document already added to this application
    const alreadyAdded = await this.applicationDocumentRepository.findOne({
      where: { 
        applicationId: createApplicationDocumentDto.applicationId,
        documentId: createApplicationDocumentDto.documentId,
      },
    });
    if (alreadyAdded) {
      return alreadyAdded; // return existing record instead of duplicating
    }

    const newApplicationDocument = this.applicationDocumentRepository.create({
      application: existApplication,
      document: existDocument,
      displayOrder: createApplicationDocumentDto.displayOrder ?? 1,
    });

    return await this.applicationDocumentRepository.save(newApplicationDocument);
  }

  // GET ALL - admin only
  async findAll() {
    return await this.applicationDocumentRepository.find({
      relations: ['application', 'document'],
    });
  }

  // GET ALL DOCUMENTS FOR AN APPLICATION
  async findByApplicationId(applicationId: string) {
    const application = await this.jobApplicationRepository.findOneBy({ 
      id: applicationId 
    });
    if (!application) {
      throw new NotFoundException(`Application with id ${applicationId} not found`);
    }

    return await this.applicationDocumentRepository.find({
      where: { applicationId },
      relations: ['document'],
      order: { displayOrder: 'ASC' }, // return in display order
    });
  }

  // GET ONE
  async findOne(id: string) {
    const doc = await this.applicationDocumentRepository.findOne({ 
      where: { id }, 
      relations: ['application', 'document'],
    });
    if (!doc) {
      throw new NotFoundException(`Application document with id ${id} not found`);
    }
    return doc;
  }

  // REORDER DOCUMENTS - PATCH /applications/:appId/documents/reorder
  async reorder(applicationId: string, orderedDocumentIds: string[]) {
    const application = await this.jobApplicationRepository.findOneBy({ 
      id: applicationId 
    });
    if (!application) {
      throw new NotFoundException(`Application with id ${applicationId} not found`);
    }

    const existingDocs = await this.applicationDocumentRepository.find({
    where: { applicationId },
    });

    if (existingDocs.length !== orderedDocumentIds.length) {
      throw new NotFoundException('Document list mismatch');
    }

    // update display order for each document based on position in array
    for (let i = 0; i < orderedDocumentIds.length; i++) {
      await this.applicationDocumentRepository.update(
        { applicationId, documentId: orderedDocumentIds[i] },
        { displayOrder: i + 1 }
      );
    }

    return this.findByApplicationId(applicationId);
  }

  // REMOVE DOCUMENT FROM APPLICATION
  async remove(applicationId: string, documentId: string) {
    const doc = await this.applicationDocumentRepository.findOne({
      where: { applicationId, documentId },
    });
    if (!doc) {
      throw new NotFoundException(`Document not found in this application`);
    }
    return await this.applicationDocumentRepository.delete(doc.id);
  }
}