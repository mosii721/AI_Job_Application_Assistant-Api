import { Injectable } from '@nestjs/common';
import { CreateJobDescriptionDto } from './dto/create-job_description.dto';
import { UpdateJobDescriptionDto } from './dto/update-job_description.dto';

@Injectable()
export class JobDescriptionsService {
  create(createJobDescriptionDto: CreateJobDescriptionDto) {
    return 'This action adds a new jobDescription';
  }

  findAll() {
    return `This action returns all jobDescriptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobDescription`;
  }

  update(id: number, updateJobDescriptionDto: UpdateJobDescriptionDto) {
    return `This action updates a #${id} jobDescription`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobDescription`;
  }
}
