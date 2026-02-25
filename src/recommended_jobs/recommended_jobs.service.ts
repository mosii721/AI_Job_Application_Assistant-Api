import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecommendedJobDto } from './dto/create-recommended_job.dto';
import { UpdateRecommendedJobDto } from './dto/update-recommended_job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RecommendedJob } from './entities/recommended_job.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Injectable()
export class RecommendedJobsService {
  constructor(
    @InjectRepository(RecommendedJob) private readonly recommendedJobRepository: Repository<RecommendedJob>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>
  ) {}

  async create(createRecommendedJobDto: CreateRecommendedJobDto) {
    const existUser = await this.userRepository.findOneBy({ id: createRecommendedJobDto.userId });
    const existJob = await this.jobRepository.findOneBy({ id: createRecommendedJobDto.jobId });

    if(!existUser){
      throw new NotFoundException(`User with id ${createRecommendedJobDto.userId} not found`);
    } 
    if(!existJob){
      throw new NotFoundException(`Job with id ${createRecommendedJobDto.jobId} not found`);
    }

    const newRecommendedJob = this.recommendedJobRepository.create({
      user: existUser,
      job: existJob,
      basicMatchScore: createRecommendedJobDto.basicMatchScore,
      isProcessed: createRecommendedJobDto.isProcessed  || false,
      sourceApi: createRecommendedJobDto.sourceApi,
    })
    return this.recommendedJobRepository.save(newRecommendedJob);
  }

  async findAll() {
    return this.recommendedJobRepository.find({relations:['user','job']});
  }

  async findOne(id: string) {
    return await this.recommendedJobRepository.findOne({where: {id}, relations:['user','job']});
  }

  async update(id: string, updateRecommendedJobDto: UpdateRecommendedJobDto) {
    return await this.recommendedJobRepository.update(id, updateRecommendedJobDto);
  }

  async remove(id: string) {
    return await this.recommendedJobRepository.delete(id);
  }
}
