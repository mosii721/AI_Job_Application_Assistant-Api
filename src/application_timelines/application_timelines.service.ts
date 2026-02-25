import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationTimelineDto } from './dto/create-application_timeline.dto';
import { UpdateApplicationTimelineDto } from './dto/update-application_timeline.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationTimeline } from './entities/application_timeline.entity';
import { Repository } from 'typeorm';
import { JobApplication } from 'src/job_applications/entities/job_application.entity';

@Injectable()
export class ApplicationTimelinesService {
  constructor(
    @InjectRepository(ApplicationTimeline) private readonly applicationTimelineRepository: Repository<ApplicationTimeline>,
    @InjectRepository(JobApplication) private readonly jobApplicationRepository: Repository<JobApplication>
  ){}

  async create(createApplicationTimelineDto: CreateApplicationTimelineDto) {
    const existApplication = await this.jobApplicationRepository.findOneBy({ id: createApplicationTimelineDto.applicationId });
    
    if(!existApplication){
      throw new NotFoundException(`Application with id ${createApplicationTimelineDto.applicationId} not found`);
    }
    
    const newApplicationTimeline = this.applicationTimelineRepository.create({
      application: existApplication,
      eventType: createApplicationTimelineDto.eventType,
      previousStatus: createApplicationTimelineDto.previousStatus,
      newStatus: createApplicationTimelineDto.newStatus,
      notes: createApplicationTimelineDto.notes,
    });
    return await this.applicationTimelineRepository.save(newApplicationTimeline);
  }

  async findAll() {
    return await this.applicationTimelineRepository.find({relations: ['application']});
  }

  async findOne(id: string) {
    return await this.applicationTimelineRepository.findOne({ where: { id }, relations: ['application'] });
  }

  async update(id: string, updateApplicationTimelineDto: UpdateApplicationTimelineDto) {
    return await this.applicationTimelineRepository.update(id, updateApplicationTimelineDto);
  }

  async remove(id: string) {
    return await this.applicationTimelineRepository.delete(id);
  }
}
