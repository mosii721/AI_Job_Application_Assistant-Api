import { Injectable } from '@nestjs/common';
import { CreateAiSuggesstionDto } from './dto/create-ai_suggesstion.dto';
import { UpdateAiSuggesstionDto } from './dto/update-ai_suggesstion.dto';

@Injectable()
export class AiSuggesstionsService {
  create(createAiSuggesstionDto: CreateAiSuggesstionDto) {
    return 'This action adds a new aiSuggesstion';
  }

  findAll() {
    return `This action returns all aiSuggesstions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aiSuggesstion`;
  }

  update(id: number, updateAiSuggesstionDto: UpdateAiSuggesstionDto) {
    return `This action updates a #${id} aiSuggesstion`;
  }

  remove(id: number) {
    return `This action removes a #${id} aiSuggesstion`;
  }
}
