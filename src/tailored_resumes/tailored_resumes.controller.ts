import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TailoredResumesService } from './tailored_resumes.service';
import { CreateTailoredResumeDto } from './dto/create-tailored_resume.dto';
import { UpdateTailoredResumeDto } from './dto/update-tailored_resume.dto';

@Controller('tailored-resumes')
export class TailoredResumesController {
  constructor(private readonly tailoredResumesService: TailoredResumesService) {}

  @Post()
  create(@Body() createTailoredResumeDto: CreateTailoredResumeDto) {
    return this.tailoredResumesService.create(createTailoredResumeDto);
  }

  @Get()
  findAll() {
    return this.tailoredResumesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tailoredResumesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTailoredResumeDto: UpdateTailoredResumeDto) {
    return this.tailoredResumesService.update(+id, updateTailoredResumeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tailoredResumesService.remove(+id);
  }
}
