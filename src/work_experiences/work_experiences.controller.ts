import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkExperiencesService } from './work_experiences.service';
import { CreateWorkExperienceDto } from './dto/create-work_experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work_experience.dto';

@Controller('work-experiences')
export class WorkExperiencesController {
  constructor(private readonly workExperiencesService: WorkExperiencesService) {}

  @Post()
  create(@Body() createWorkExperienceDto: CreateWorkExperienceDto) {
    return this.workExperiencesService.create(createWorkExperienceDto);
  }

  @Get()
  findAll() {
    return this.workExperiencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workExperiencesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkExperienceDto: UpdateWorkExperienceDto) {
    return this.workExperiencesService.update(+id, updateWorkExperienceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workExperiencesService.remove(+id);
  }
}
