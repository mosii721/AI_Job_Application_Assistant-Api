import { Injectable } from '@nestjs/common';
import { CreateCoverLetterDto } from './dto/create-cover_letter.dto';
import { UpdateCoverLetterDto } from './dto/update-cover_letter.dto';

@Injectable()
export class CoverLettersService {
  create(createCoverLetterDto: CreateCoverLetterDto) {
    return 'This action adds a new coverLetter';
  }

  findAll() {
    return `This action returns all coverLetters`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coverLetter`;
  }

  update(id: number, updateCoverLetterDto: UpdateCoverLetterDto) {
    return `This action updates a #${id} coverLetter`;
  }

  remove(id: number) {
    return `This action removes a #${id} coverLetter`;
  }
}
