import { Injectable } from '@nestjs/common';
import { CreateKeywordResultDto } from './dto/create-keyword_result.dto';
import { UpdateKeywordResultDto } from './dto/update-keyword_result.dto';

@Injectable()
export class KeywordResultsService {
  create(createKeywordResultDto: CreateKeywordResultDto) {
    return 'This action adds a new keywordResult';
  }

  findAll() {
    return `This action returns all keywordResults`;
  }

  findOne(id: number) {
    return `This action returns a #${id} keywordResult`;
  }

  update(id: number, updateKeywordResultDto: UpdateKeywordResultDto) {
    return `This action updates a #${id} keywordResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} keywordResult`;
  }
}
