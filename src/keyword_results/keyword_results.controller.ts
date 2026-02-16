import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KeywordResultsService } from './keyword_results.service';
import { CreateKeywordResultDto } from './dto/create-keyword_result.dto';
import { UpdateKeywordResultDto } from './dto/update-keyword_result.dto';

@Controller('keyword-results')
export class KeywordResultsController {
  constructor(private readonly keywordResultsService: KeywordResultsService) {}

  @Post()
  create(@Body() createKeywordResultDto: CreateKeywordResultDto) {
    return this.keywordResultsService.create(createKeywordResultDto);
  }

  @Get()
  findAll() {
    return this.keywordResultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keywordResultsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKeywordResultDto: UpdateKeywordResultDto) {
    return this.keywordResultsService.update(+id, updateKeywordResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.keywordResultsService.remove(+id);
  }
}
