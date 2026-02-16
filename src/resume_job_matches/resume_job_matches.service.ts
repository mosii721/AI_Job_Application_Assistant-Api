import { Injectable } from '@nestjs/common';
import { CreateResumeJobMatchDto } from './dto/create-resume_job_match.dto';
import { UpdateResumeJobMatchDto } from './dto/update-resume_job_match.dto';

@Injectable()
export class ResumeJobMatchesService {
  create(createResumeJobMatchDto: CreateResumeJobMatchDto) {
    return 'This action adds a new resumeJobMatch';
  }

  findAll() {
    return `This action returns all resumeJobMatches`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resumeJobMatch`;
  }

  update(id: number, updateResumeJobMatchDto: UpdateResumeJobMatchDto) {
    return `This action updates a #${id} resumeJobMatch`;
  }

  remove(id: number) {
    return `This action removes a #${id} resumeJobMatch`;
  }
}
