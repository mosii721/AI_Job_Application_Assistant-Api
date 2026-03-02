import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationVersionDto } from './dto/create-application_version.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationVersion,ContentType } from './entities/application_version.entity';
import { Repository } from 'typeorm';
import { JobApplication } from 'src/job_applications/entities/job_application.entity';

@Injectable()
export class ApplicationVersionsService {
  constructor(
    @InjectRepository(ApplicationVersion) 
    private readonly applicationVersionRepository: Repository<ApplicationVersion>,
    @InjectRepository(JobApplication) 
    private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}

  // CREATE - called internally from JobApplicationsService not frontend
  async create(createApplicationVersionDto: CreateApplicationVersionDto) {
    const existApplication = await this.jobApplicationRepository.findOneBy({ 
      id: createApplicationVersionDto.applicationId 
    });
    if (!existApplication) {
      throw new NotFoundException(`Application with id ${createApplicationVersionDto.applicationId} not found`);
    }

    const newApplicationVersion = this.applicationVersionRepository.create({
      application: existApplication,
      contentType: createApplicationVersionDto.contentType,
      contentData: createApplicationVersionDto.contentData,
      created_by: createApplicationVersionDto.created_by,
    });

    return await this.applicationVersionRepository.save(newApplicationVersion);
  }

  // GET ALL - admin only
  async findAll() {
    return await this.applicationVersionRepository.find({
      relations: ['application'],
    });
  }

  // GET ALL VERSIONS FOR AN APPLICATION
  async findByApplicationId(applicationId: string, contentType?: ContentType) {
    const application = await this.jobApplicationRepository.findOneBy({ 
      id: applicationId 
    });
    if (!application) {
      throw new NotFoundException(`Application with id ${applicationId} not found`);
    }

    const where: any = { applicationId };
    if (contentType) where.contentType = contentType;

    return await this.applicationVersionRepository.find({
      where,
      order: { createdAt: 'ASC' }, // oldest first so version numbers are clear
    });
  }

  // GET ONE VERSION
  async findOne(id: string) {
    const version = await this.applicationVersionRepository.findOne({
      where: { id }, 
      relations: ['application'],
    });
    if (!version) {
      throw new NotFoundException(`Version with id ${id} not found`);
    }
    return version;
  }

  // GET COVER LETTER VERSIONS ONLY
  async findCoverLetterVersions(applicationId: string) {
    return this.findByApplicationId(applicationId, ContentType.COVER_LETTER);
  }

  // GET EMAIL VERSIONS ONLY
  async findEmailVersions(applicationId: string) {
    return this.findByApplicationId(applicationId, ContentType.EMAIL);
  }

  // GET RESUME BULLET VERSIONS ONLY
  async findResumeBulletVersions(applicationId: string) {
    return this.findByApplicationId(applicationId, ContentType.RESUME_BULLET);
  }
}