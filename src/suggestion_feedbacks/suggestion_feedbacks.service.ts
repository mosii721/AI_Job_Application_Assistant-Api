import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuggestionFeedbackDto } from './dto/create-suggestion_feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SuggestionFeedback,SuggestionContentType } from './entities/suggestion_feedback.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JobApplication } from 'src/job_applications/entities/job_application.entity';

@Injectable()
export class SuggestionFeedbacksService {
  constructor(
    @InjectRepository(SuggestionFeedback) 
    private readonly suggestionFeedbackRepository: Repository<SuggestionFeedback>,
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    @InjectRepository(JobApplication) 
    private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}

  // CREATE - called when user accepts/rejects an AI suggestion
  async create(createSuggestionFeedbackDto: CreateSuggestionFeedbackDto) {
    const existUser = await this.userRepository.findOne({ 
      where: { id: createSuggestionFeedbackDto.userId } 
    });
    if (!existUser) {
      throw new NotFoundException(`User with id ${createSuggestionFeedbackDto.userId} not found`);
    }

    let application: JobApplication | null = null;
    if (createSuggestionFeedbackDto.applicationId) {
      application = await this.jobApplicationRepository.findOneBy({ 
        id: createSuggestionFeedbackDto.applicationId 
      });
      if (!application) {
        throw new NotFoundException(`Job Application with id ${createSuggestionFeedbackDto.applicationId} not found`);
      }
    }

    const newSuggestion = this.suggestionFeedbackRepository.create({
      user: existUser,
      application: application ?? undefined,
      contentType: createSuggestionFeedbackDto.contentType,
      originalContent: createSuggestionFeedbackDto.originalContent,
      suggestedContent: createSuggestionFeedbackDto.suggestedContent,
      action: createSuggestionFeedbackDto.action,
    });

    return await this.suggestionFeedbackRepository.save(newSuggestion);
  }

  // GET ALL - admin only
  async findAll() {
    return await this.suggestionFeedbackRepository.find({ 
      relations: ['user', 'application'] 
    });
  }

  // GET ALL FEEDBACK FOR A USER
  async findByUserId(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return await this.suggestionFeedbackRepository.find({
      where: { userId },
      relations: ['application'],
      order: { createdAt: 'DESC' },
    });
  }

  // GET ALL FEEDBACK FOR AN APPLICATION
  async findByApplicationId(applicationId: string, contentType?: SuggestionContentType) {
    const application = await this.jobApplicationRepository.findOneBy({ 
      id: applicationId 
    });
    if (!application) {
      throw new NotFoundException(`Application with id ${applicationId} not found`);
    }

    const where: any = { applicationId };
    if (contentType) where.contentType = contentType;

    return await this.suggestionFeedbackRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  // GET ONE
  async findOne(id: string) {
    const feedback = await this.suggestionFeedbackRepository.findOne({ 
      where: { id }, 
      relations: ['user', 'application'] 
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with id ${id} not found`);
    }
    return feedback;
  }

  // GET FEEDBACK SUMMARY FOR USER - used by AI to personalize future suggestions
  async getFeedbackSummary(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const allFeedback = await this.suggestionFeedbackRepository.find({
      where: { userId },
    });

    // compute acceptance rates per content type
    // AI uses this to personalize future suggestions
    const summary = {
      total: allFeedback.length,
      by_content_type: {} as Record<string, { 
        accepted: number; 
        rejected: number; 
        ignored: number; 
        acceptance_rate: number 
      }>,
    };

    for (const type of Object.values(SuggestionContentType)) {
      const typeFeedback = allFeedback.filter(f => f.contentType === type);
      const accepted = typeFeedback.filter(f => f.action === 'accept').length;
      const rejected = typeFeedback.filter(f => f.action === 'reject').length;
      const ignored = typeFeedback.filter(f => f.action === 'ignore').length;
      const total = typeFeedback.length;

      summary.by_content_type[type] = {
        accepted,
        rejected,
        ignored,
        acceptance_rate: total > 0 ? Math.round((accepted / total) * 100) : 0,
      };
    }

    return summary;
  }
}