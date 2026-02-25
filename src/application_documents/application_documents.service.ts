import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDocumentDto } from './dto/create-application_document.dto';
import { UpdateApplicationDocumentDto } from './dto/update-application_document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationDocument } from './entities/application_document.entity';
import { Repository } from 'typeorm';
import { JobApplication } from 'src/job_applications/entities/job_application.entity';
import { UserDocument } from 'src/user_documents/entities/user_document.entity';

@Injectable()
export class ApplicationDocumentsService {
  constructor(
    @InjectRepository(ApplicationDocument) private readonly applicationDocumentRepository: Repository<ApplicationDocument>,
    @InjectRepository(JobApplication) private readonly jobApplicationRepository: Repository<JobApplication>,
    @InjectRepository(UserDocument) private readonly userDocumentRepository: Repository<UserDocument>
  ) {}

  async create(createApplicationDocumentDto: CreateApplicationDocumentDto) {
    const existApplication = await this.jobApplicationRepository.findOneBy({ id: createApplicationDocumentDto.applicationId });
    const existDocument = await this.userDocumentRepository.findOneBy({ id: createApplicationDocumentDto.documentId });
    
    if(!existApplication){
      throw new NotFoundException(`Application with id ${createApplicationDocumentDto.applicationId} not found`);
    }
    if(!existDocument){
      throw new NotFoundException(`Document with id ${createApplicationDocumentDto.documentId} not found`);
    }
    const newApplicationDocument = this.applicationDocumentRepository.create({
      application: existApplication,
      document: existDocument,
      displayOrder: createApplicationDocumentDto.displayOrder
    });
    return await this.applicationDocumentRepository.save(newApplicationDocument);
  }

  async findAll() {
    return await this.applicationDocumentRepository.find({relations: ['application', 'document']});
  }

  async findOne(id: string) {
    return await this.applicationDocumentRepository.findOne({ where: { id }, relations: ['application', 'document'] });
  }

  async update(id: string, updateApplicationDocumentDto: UpdateApplicationDocumentDto) {
    return await this.applicationDocumentRepository.update(id,updateApplicationDocumentDto);
  }

  async remove(id: string) {
    return await this.applicationDocumentRepository.delete(id);
  }
}
