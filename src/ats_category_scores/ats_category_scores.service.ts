import { Injectable } from '@nestjs/common';
import { CreateAtsCategoryScoreDto } from './dto/create-ats_category_score.dto';
import { UpdateAtsCategoryScoreDto } from './dto/update-ats_category_score.dto';

@Injectable()
export class AtsCategoryScoresService {
  create(createAtsCategoryScoreDto: CreateAtsCategoryScoreDto) {
    return 'This action adds a new atsCategoryScore';
  }

  findAll() {
    return `This action returns all atsCategoryScores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} atsCategoryScore`;
  }

  update(id: number, updateAtsCategoryScoreDto: UpdateAtsCategoryScoreDto) {
    return `This action updates a #${id} atsCategoryScore`;
  }

  remove(id: number) {
    return `This action removes a #${id} atsCategoryScore`;
  }
}
