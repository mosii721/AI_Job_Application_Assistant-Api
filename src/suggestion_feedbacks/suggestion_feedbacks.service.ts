import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuggestionFeedbackDto } from './dto/create-suggestion_feedback.dto';
import { UpdateSuggestionFeedbackDto } from './dto/update-suggestion_feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SuggestionFeedback } from './entities/suggestion_feedback.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JobApplication } from 'src/job_applications/entities/job_application.entity';

@Injectable()
export class SuggestionFeedbacksService {
  constructor(
    @InjectRepository(SuggestionFeedback) private readonly sugggestionFeedbackRepository: Repository<SuggestionFeedback>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(JobApplication) private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}
  
  async create(createSuggestionFeedbackDto: CreateSuggestionFeedbackDto) {
    const existUser = await this.userRepository.findOne({where: {id: createSuggestionFeedbackDto.userId}})

    if(!existUser) {
      throw new NotFoundException(`User with id ${createSuggestionFeedbackDto.userId} not found`)
    }

    let application: JobApplication | null = null;
    if(createSuggestionFeedbackDto.applicationId){
      application = await this.jobApplicationRepository.findOneBy({ id: createSuggestionFeedbackDto.applicationId});
    if(!application) {
      throw new NotFoundException(` Job Application with id ${createSuggestionFeedbackDto.applicationId} not found`)
    }
    }

    const newSuggestion = this.sugggestionFeedbackRepository.create({
      user: existUser,
      application: application ?? undefined,
      contentType: createSuggestionFeedbackDto.contentType,
      originalContent: createSuggestionFeedbackDto.originalContent,
      suggestedContent: createSuggestionFeedbackDto.suggestedContent,
      action: createSuggestionFeedbackDto.action,
    })
    return await this.sugggestionFeedbackRepository.save(newSuggestion)
  }

  async findAll() {
    return await this.sugggestionFeedbackRepository.find({relations:['user','application']})
  }

  async findOne(id: string) {
    return await this.sugggestionFeedbackRepository.find({ where:{ id }, relations:['user','application']})
  }

  async update(id: string, updateSuggestionFeedbackDto: UpdateSuggestionFeedbackDto) {
    return await this.sugggestionFeedbackRepository.update(id,updateSuggestionFeedbackDto)
  }

  async remove(id: string) {
    return await this.sugggestionFeedbackRepository.delete(id)
  }
}
