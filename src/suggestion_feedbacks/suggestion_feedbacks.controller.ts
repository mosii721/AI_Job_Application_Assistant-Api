import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { SuggestionFeedbacksService } from './suggestion_feedbacks.service';
import { CreateSuggestionFeedbackDto } from './dto/create-suggestion_feedback.dto';
import { SuggestionContentType } from './entities/suggestion_feedback.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('suggestion-feedbacks')
@ApiBearerAuth()
@Controller('feedback')
export class SuggestionFeedbacksController {
  constructor(private readonly suggestionFeedbacksService: SuggestionFeedbacksService) {}

  // CREATE - user accepts/rejects AI suggestion
  @Post('suggestion')
  create(@Body() createSuggestionFeedbackDto: CreateSuggestionFeedbackDto) {
    return this.suggestionFeedbacksService.create(createSuggestionFeedbackDto);
  }

  // GET ALL - admin only
  @Get()
  findAll() {
    return this.suggestionFeedbacksService.findAll();
  }

  // GET FEEDBACK SUMMARY FOR USER - used by AI personalization
  @Get('summary/:userId')
  getFeedbackSummary(@Param('userId') userId: string) {
    return this.suggestionFeedbacksService.getFeedbackSummary(userId);
  }

  // GET ALL FEEDBACK FOR A USER
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.suggestionFeedbacksService.findByUserId(userId);
  }

  // GET ALL FEEDBACK FOR AN APPLICATION
  @Get('application/:applicationId')
  @ApiQuery({ name: 'contentType', required: false, enum: SuggestionContentType })
  findByApplicationId(
    @Param('applicationId') applicationId: string,
    @Query('contentType') contentType?: SuggestionContentType,
  ) {
    return this.suggestionFeedbacksService.findByApplicationId(applicationId, contentType);
  }

  // GET ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suggestionFeedbacksService.findOne(id);
  }
}