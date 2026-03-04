import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobApplicationsService } from './job_applications.service';
import { ApplicationStatus } from './entities/job_application.entity';
import { SuggestionAction } from 'src/suggestion_feedbacks/entities/suggestion_feedback.entity';
import { UpdateJobApplicationDto } from './dto/update-job_application.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('job-applications')
@ApiBearerAuth()
@Controller('job-applications')
export class JobApplicationsController {
  constructor(private readonly jobApplicationsService: JobApplicationsService) {}

  // CREATE - only needs userId and jobId
  @Post()
  @ApiBody({ schema: { properties: { userId: { type: 'string' }, jobId: { type: 'string' } } } })
  create(@Body() body: { userId: string; jobId: string }) {
    return this.jobApplicationsService.create(body.userId, body.jobId);
  }

  // GET ALL - admin only
  @Get()
  findAll() {
    return this.jobApplicationsService.findAll();
  }

  // GET ALL FOR A USER
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.jobApplicationsService.findByUser(userId);
  }

  // GET ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobApplicationsService.findOne(id);
  }

  // GENERAL UPDATE
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobApplicationDto: UpdateJobApplicationDto
  ) {
    return this.jobApplicationsService.update(id, updateJobApplicationDto);
  }

  // AUTO-SAVE tailored data edits
  @Patch(':id/tailored-data')
  @ApiBody({ schema: { properties: { section: { type: 'string' }, newValue: {} } } })
  updateTailoredData(
    @Param('id') id: string,
    @Body() body: { section: string; newValue: any }
  ) {
    return this.jobApplicationsService.updateTailoredData(id, body.section, body.newValue);
  }

  // UPDATE STATUS
  @Patch(':id/status')
  @ApiBody({ schema: { properties: { status: { type: 'string', enum: Object.values(ApplicationStatus) }, notes: { type: 'string' } } } })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ApplicationStatus; notes?: string }
  ) {
    return this.jobApplicationsService.updateStatus(id, body.status, body.notes);
  }

  // FINALIZE APPLICATION
  @Post(':id/finalize')
  finalize(@Param('id') id: string) {
    return this.jobApplicationsService.finalize(id);
  }

  // GENERATE COVER LETTER
  @Post(':id/cover-letter')
  @ApiBody({ schema: { properties: { tone: { type: 'string' }, length: { type: 'string' }, emphasize: { type: 'array', items: { type: 'string' } } } } })
  generateCoverLetter(
    @Param('id') id: string,
    @Body() body: { 
      tone?: string; 
      length?: string; 
      emphasize?: string[] 
    }
  ) {
    return this.jobApplicationsService.generateCoverLetter(id, body);
  }

  // UPDATE COVER LETTER MANUALLY
  @Patch(':id/cover-letter')
  @ApiBody({ schema: { properties: { content: { type: 'string' } } } })
  updateCoverLetter(
    @Param('id') id: string,
    @Body() body: { content: string }
  ) {
    return this.jobApplicationsService.updateCoverLetter(id, body.content);
  }

  // REFINE COVER LETTER BASED ON FEEDBACK
  @Post(':id/cover-letter/refine')
  @ApiBody({ schema: { properties: { feedback: { type: 'string' }, constraints: { type: 'object' } } } })
  refineCoverLetter(
    @Param('id') id: string,
    @Body() body: { feedback: string; constraints?: { max_words?: number } }
  ) {
    return this.jobApplicationsService.refineCoverLetter(id, body.feedback, body.constraints);
  }

  // REVERT COVER LETTER TO PREVIOUS VERSION
  @Post(':id/cover-letter/revert')
  @ApiBody({ schema: { properties: { version: { type: 'number' } } } })
  revertCoverLetter(
    @Param('id') id: string,
    @Body() body: { version: number }
  ) {
    return this.jobApplicationsService.revertCoverLetter(id, body.version);
  }

  // GENERATE EMAIL
  @Post(':id/email')
  @ApiBody({ schema: { properties: { tone: { type: 'string' }, include_cover_letter: { type: 'boolean' } } } })
  generateEmail(
    @Param('id') id: string,
    @Body() body: { tone?: string; include_cover_letter?: boolean }
  ) {
    return this.jobApplicationsService.generateEmail(id, body);
  }

  // UPDATE EMAIL MANUALLY
  @Patch(':id/email')
  @ApiBody({ schema: { properties: { subject: { type: 'string' }, body: { type: 'string' } } } })
  updateEmail(
    @Param('id') id: string,
    @Body() body: { subject?: string; body?: string }
  ) {
    return this.jobApplicationsService.updateEmail(id, body);
  }

  // GET MATCH ANALYSIS
  @Get(':id/match-analysis')
  getMatchAnalysis(@Param('id') id: string) {
    return this.jobApplicationsService.getMatchAnalysis(id);
  }

  // SUGGEST BULLET IMPROVEMENTS
  @Post(':id/resume/bullets/suggest')
  @ApiBody({ schema: { properties: { experienceIndex: { type: 'number' }, bulletIndex: { type: 'number' } } } })
  suggestBulletImprovements(
    @Param('id') id: string,
    @Body() body: { experienceIndex: number; bulletIndex: number }
  ) {
    return this.jobApplicationsService.suggestBulletImprovements(id, body.bulletIndex, body.experienceIndex);
  }

  // UPDATE RESUME BULLET
  @Patch(':id/resume/bullets')
  @ApiBody({ schema: { properties: { experienceIndex: { type: 'number' }, newDescription: { type: 'string' }, action: { type: 'string', enum: Object.values(SuggestionAction) }, originalContent: { type: 'string' }, suggestedContent: { type: 'string' } } } })
  updateResumeBullet(
    @Param('id') id: string,
    @Body() body: { 
      experienceIndex: number;
      newDescription: string;
      action: SuggestionAction;
      originalContent: string;
      suggestedContent: string;
    }
  ) {
    return this.jobApplicationsService.updateResumeBullet(
      id,
      body.experienceIndex,
      body.newDescription,
      body.action,
      body.originalContent,
      body.suggestedContent,
    );
  }

  // GENERATE PDF
  @Post(':id/pdf')
  generatePdf(@Param('id') id: string) {
    return this.jobApplicationsService.generatePdf(id);
  }

  // PREVIEW PDF
  @Get(':id/pdf/preview')
  previewPdf(@Param('id') id: string) {
    return this.jobApplicationsService.previewPdf(id);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobApplicationsService.remove(id);
  }

  
}