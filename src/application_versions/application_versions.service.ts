import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationVersionDto } from './dto/create-application_version.dto';
import { UpdateApplicationVersionDto } from './dto/update-application_version.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationVersion } from './entities/application_version.entity';
import { Repository } from 'typeorm';
import { JobApplication } from 'src/job_applications/entities/job_application.entity';

@Injectable()
export class ApplicationVersionsService {
  constructor(
    @InjectRepository(ApplicationVersion) private readonly applicationVersionRepository: Repository<ApplicationVersion>,
    @InjectRepository(JobApplication) private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}

  async create(createApplicationVersionDto: CreateApplicationVersionDto) {
    const existApplication = await this.jobApplicationRepository.findOneBy({ id: createApplicationVersionDto.applicationId });
    
    if(!existApplication){
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


  async findAll() {
    return await this.applicationVersionRepository.find({relations: ['application']});
  }

  async findOne(id: string) {
    return await this.applicationVersionRepository.find({where:{id}, relations: ['application']});
  }

  async update(id: string, updateApplicationVersionDto: UpdateApplicationVersionDto) {
    return await this.applicationVersionRepository.update(id, updateApplicationVersionDto);
  }

  async remove(id: string) {
    return await this.applicationVersionRepository.delete(id);
  }
}
