import { Injectable } from '@nestjs/common';
import { CreateTailoredResumeDto } from './dto/create-tailored_resume.dto';
import { UpdateTailoredResumeDto } from './dto/update-tailored_resume.dto';

@Injectable()
export class TailoredResumesService {
  create(createTailoredResumeDto: CreateTailoredResumeDto) {
    return 'This action adds a new tailoredResume';
  }

  findAll() {
    return `This action returns all tailoredResumes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tailoredResume`;
  }

  update(id: number, updateTailoredResumeDto: UpdateTailoredResumeDto) {
    return `This action updates a #${id} tailoredResume`;
  }

  remove(id: number) {
    return `This action removes a #${id} tailoredResume`;
  }
}
