import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoverLettersService } from './cover_letters.service';
import { CreateCoverLetterDto } from './dto/create-cover_letter.dto';
import { UpdateCoverLetterDto } from './dto/update-cover_letter.dto';

@Controller('cover-letters')
export class CoverLettersController {
  constructor(private readonly coverLettersService: CoverLettersService) {}

  @Post()
  create(@Body() createCoverLetterDto: CreateCoverLetterDto) {
    return this.coverLettersService.create(createCoverLetterDto);
  }

  @Get()
  findAll() {
    return this.coverLettersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coverLettersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoverLetterDto: UpdateCoverLetterDto) {
    return this.coverLettersService.update(+id, updateCoverLetterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coverLettersService.remove(+id);
  }
}
