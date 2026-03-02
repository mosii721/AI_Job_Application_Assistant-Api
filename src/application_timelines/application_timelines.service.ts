import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationTimelineDto } from './dto/create-application_timeline.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationTimeline,EventType } from './entities/application_timeline.entity';
import { Repository } from 'typeorm';
import { JobApplication } from 'src/job_applications/entities/job_application.entity';

@Injectable()
export class ApplicationTimelinesService {
  constructor(
    @InjectRepository(ApplicationTimeline) 
    private readonly applicationTimelineRepository: Repository<ApplicationTimeline>,
    @InjectRepository(JobApplication) 
    private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}

  // CREATE - called internally from JobApplicationsService not frontend
  async create(createApplicationTimelineDto: CreateApplicationTimelineDto) {
    const existApplication = await this.jobApplicationRepository.findOneBy({ 
      id: createApplicationTimelineDto.applicationId 
    });
    if (!existApplication) {
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

  // GET ALL - admin only
  async findAll() {
    return await this.applicationTimelineRepository.find({
      relations: ['application'],
    });
  }

  // GET TIMELINE FOR AN APPLICATION
  async findByApplicationId(applicationId: string, eventType?: EventType) {
    const application = await this.jobApplicationRepository.findOneBy({ 
      id: applicationId 
    });
    if (!application) {
      throw new NotFoundException(`Application with id ${applicationId} not found`);
    }

    const where: any = { applicationId };
    if (eventType) where.eventType = eventType;

    return await this.applicationTimelineRepository.find({
      where,
      order: { eventDate: 'ASC' }, // chronological order
    });
  }

  // GET ONE EVENT
  async findOne(applicationId: string, id: string) {
  const event = await this.applicationTimelineRepository.findOne({
    where: { id, applicationId },
    relations: ['application'],
  });

  if (!event) {
    throw new NotFoundException(
      `Timeline event with id ${id} not found for this application`,
    );
  }

  return event;
}
}