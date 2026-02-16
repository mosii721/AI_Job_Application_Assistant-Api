import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AtsCategoryScoresService } from './ats_category_scores.service';
import { CreateAtsCategoryScoreDto } from './dto/create-ats_category_score.dto';
import { UpdateAtsCategoryScoreDto } from './dto/update-ats_category_score.dto';

@Controller('ats-category-scores')
export class AtsCategoryScoresController {
  constructor(private readonly atsCategoryScoresService: AtsCategoryScoresService) {}

  @Post()
  create(@Body() createAtsCategoryScoreDto: CreateAtsCategoryScoreDto) {
    return this.atsCategoryScoresService.create(createAtsCategoryScoreDto);
  }

  @Get()
  findAll() {
    return this.atsCategoryScoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atsCategoryScoresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAtsCategoryScoreDto: UpdateAtsCategoryScoreDto) {
    return this.atsCategoryScoresService.update(+id, updateAtsCategoryScoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atsCategoryScoresService.remove(+id);
  }
}
