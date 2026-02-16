import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiSuggesstionsService } from './ai_suggesstions.service';
import { CreateAiSuggesstionDto } from './dto/create-ai_suggesstion.dto';
import { UpdateAiSuggesstionDto } from './dto/update-ai_suggesstion.dto';

@Controller('ai-suggesstions')
export class AiSuggesstionsController {
  constructor(private readonly aiSuggesstionsService: AiSuggesstionsService) {}

  @Post()
  create(@Body() createAiSuggesstionDto: CreateAiSuggesstionDto) {
    return this.aiSuggesstionsService.create(createAiSuggesstionDto);
  }

  @Get()
  findAll() {
    return this.aiSuggesstionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiSuggesstionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAiSuggesstionDto: UpdateAiSuggesstionDto) {
    return this.aiSuggesstionsService.update(+id, updateAiSuggesstionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiSuggesstionsService.remove(+id);
  }
}
