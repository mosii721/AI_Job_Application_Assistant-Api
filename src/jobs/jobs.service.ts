import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto) {
    const existJob = await this.jobRepository.findOne({ where: { url_hash: createJobDto.url_hash }});

    if(existJob){
      return {
        job: existJob,
        fromCache: true
      };
    }

    const newJob = this.jobRepository.create({
      title: createJobDto.title,
      company: createJobDto.company,
      location: createJobDto.location,
      raw_description: createJobDto.raw_description,
      structured_job_json: createJobDto.structured_job_json,
      job_embedding: createJobDto.job_embedding,
      source_url: createJobDto.source_url,
      url_hash: createJobDto.url_hash,
    });

    await this.jobRepository.save(newJob);

    return {
      job: newJob,
      fromCache: false
    };
  }

  async findAll(title?: string, company?: string, location?: string) {
    if(title || company || location){
      return await this.jobRepository.find({
        where: {title, company, location},
        relations:['applications','recommendations']
      })
  }
    return await this.jobRepository.find({relations:['applications','recommendations']});
  }

  async findOne(id: string) {
    return await this.jobRepository.findOne({where: {id}, relations:['applications','recommendations']});
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    return await this.jobRepository.update(id, updateJobDto);
  }

  async remove(id: string) {
    return await this.jobRepository.delete(id);
  }
}
