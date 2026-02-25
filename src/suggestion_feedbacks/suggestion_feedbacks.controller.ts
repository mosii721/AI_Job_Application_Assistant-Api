import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SuggestionFeedbacksService } from './suggestion_feedbacks.service';
import { CreateSuggestionFeedbackDto } from './dto/create-suggestion_feedback.dto';
import { UpdateSuggestionFeedbackDto } from './dto/update-suggestion_feedback.dto';

@Controller('suggestion-feedbacks')
export class SuggestionFeedbacksController {
  constructor(private readonly suggestionFeedbacksService: SuggestionFeedbacksService) {}

  @Post()
  create(@Body() createSuggestionFeedbackDto: CreateSuggestionFeedbackDto) {
    return this.suggestionFeedbacksService.create(createSuggestionFeedbackDto);
  }

  @Get()
  findAll() {
    return this.suggestionFeedbacksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suggestionFeedbacksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSuggestionFeedbackDto: UpdateSuggestionFeedbackDto) {
    return this.suggestionFeedbacksService.update(id, updateSuggestionFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suggestionFeedbacksService.remove(id);
  }
}
