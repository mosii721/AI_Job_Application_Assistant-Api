import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobApplicationDto } from './dto/create-job_application.dto';
import { UpdateJobApplicationDto } from './dto/update-job_application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplication } from './entities/job_application.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Injectable()
export class JobApplicationsService {
  constructor(
    @InjectRepository(JobApplication) private readonly jobApplicationRepository: Repository<JobApplication>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  async create(createJobApplicationDto: CreateJobApplicationDto) {
    const existUser = await this.userRepository.findOneBy({ id: createJobApplicationDto.userId });
    const existJob = await this.jobRepository.findOneBy({ id: createJobApplicationDto.jobId });

    if(!existUser){
      throw new NotFoundException(`User with id ${createJobApplicationDto.userId} not found`);
    }
    if(!existJob){
      throw new NotFoundException(`Job with id ${createJobApplicationDto.jobId} not found`);
    }

    const newJobApplication = this.jobApplicationRepository.create({
      user: existUser,
      job: existJob,
      profileVersionUsed: createJobApplicationDto.profileVersionUsed,
      overallMatchScore: createJobApplicationDto.overallMatchScore,
      skillScore: createJobApplicationDto.skillScore,
      experienceScore: createJobApplicationDto.experienceScore,
      educationScore: createJobApplicationDto.educationScore,
      matchAnalysisJson: createJobApplicationDto.matchAnalysisJson,
      tailoredResumeJson: createJobApplicationDto.tailoredResumeJson,
      coverLetterCurrent: createJobApplicationDto.coverLetterCurrent,
      coverLetterPreferencesJson: createJobApplicationDto.coverLetterPreferencesJson,
      emailSubject: createJobApplicationDto.emailSubject,
      emailBody: createJobApplicationDto.emailBody,
      resumeFileUrl: createJobApplicationDto.resumeFileUrl,
      mergedPackageUrl: createJobApplicationDto.mergedPackageUrl,
      status: createJobApplicationDto.status,
  });
    return await this.jobApplicationRepository.save(newJobApplication);
  }

  async findAll() {
    return await this.jobApplicationRepository.find({relations: ['user', 'job','versions','timeline','documents','suggestionFeedbacks']});
  }

  async findOne(id: string) {
    return await this.jobApplicationRepository.findOne({ where: { id }, relations: ['user', 'job','versions','timeline','documents','suggestionFeedbacks'] });
  }

  async update(id: string, updateJobApplicationDto: UpdateJobApplicationDto) {
    return await this.jobApplicationRepository.update(id, updateJobApplicationDto);
  }

  async remove(id: string) {
    return await this.jobApplicationRepository.delete(id);
  }
}
