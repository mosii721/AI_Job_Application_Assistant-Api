import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobApplicationsService } from './job_applications.service';
import { ApplicationStatus } from './entities/job_application.entity';
import { SuggestionAction } from 'src/suggestion_feedbacks/entities/suggestion_feedback.entity';
import { UpdateJobApplicationDto } from './dto/update-job_application.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { add } from 'cheerio/dist/commonjs/api/traversing';

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
  @ApiBody({ schema: { properties: { tone: { type: 'string' },addressee: { type: 'string', default: 'Hiring Manager' }, length: { type: 'string' }, emphasize: { type: 'array', items: { type: 'string' } } } } })
  generateCoverLetter(
    @Param('id') id: string,
    @Body() body: { 
      tone?: string; 
      length?: string; 
      emphasize?: string[];
      addressee?: string;
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
  @ApiBody({ schema: { properties: { 
    tone: { type: 'string' }, 
    include_cover_letter: { type: 'boolean' },
    addressee: { type: 'string', default: 'Hiring Manager' },
    email_type: { type: 'string', enum: ['short_intro', 'cover_letter_format', 'follow_up', 'cold_outreach'] },
    verbosity: { type: 'string', enum: ['low', 'medium', 'high'] }
  } } })
  generateEmail(
    @Param('id') id: string,
    @Body() body: { tone?: string; include_cover_letter?: boolean; email_type?: string; verbosity?: string; addressee?: string }
  ) {
    return this.jobApplicationsService.generateEmail(id, body);
  }

  // REFINE EMAIL
  @Post(':id/email/refine')
  @ApiBody({ schema: { properties: { 
    instruction: { type: 'string' },
    tone: { type: 'string' },
    email_type: { type: 'string', enum: ['short_intro', 'cover_letter_format', 'follow_up', 'cold_outreach'] },
    addressee: { type: 'string', default: 'Hiring Manager' },
    verbosity: { type: 'string', enum: ['low', 'medium', 'high'] }
  } } })
  refineEmail(
    @Param('id') id: string,
    @Body() body: { instruction: string; tone?: string; email_type?: string; addressee?: string; verbosity?: string }
  ) {
    return this.jobApplicationsService.refineEmail(id, body.instruction, body);
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
  @Post(':id/resume/experience/snapshot')
  generateExperienceSnapshot(@Param('id') id: string) {
    return this.jobApplicationsService.generateExperienceSnapshot(id);
  }

  @Post(':id/resume/summary/snapshot')
  generateSummarySnapshot(@Param('id') id: string) {
    return this.jobApplicationsService.generateSummarySnapshot(id);
  }

  @Post(':id/resume/skills/snapshot')
  generateSkillsSnapshot(@Param('id') id: string) {
    return this.jobApplicationsService.generateSkillsSnapshot(id);
  }

  @Post(':id/resume/education/snapshot')
  generateEducationSnapshot(@Param('id') id: string) {
    return this.jobApplicationsService.generateEducationSnapshot(id);
  }

  // UPDATE RESUME BULLET
  @Patch(':id/resume/bullets')
  @ApiBody({ schema: { properties: { experienceIndex: { type: 'number' }, newBullets: { type: 'array', items: { type: 'string' } }, action: { type: 'string', enum: Object.values(SuggestionAction) }, originalContent: { type: 'string' }, suggestedContent: { type: 'string' } } } })
  updateResumeBullet(
    @Param('id') id: string,
    @Body() body: { 
      experienceIndex: number;
      newBullets: string[];
      action: SuggestionAction;
      originalContent: string;
      suggestedContent: string;
    }
  ) {
    return this.jobApplicationsService.updateResumeBullet(
      id,
      body.experienceIndex,
      body.newBullets,
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

    // RESCORE APPLICATION
  @Post(':id/rescore')
  @ApiBody({ schema: { properties: { approved_sections: { type: 'object' } } } })
  rescoreApplication(
    @Param('id') id: string,
    @Body() body: { approved_sections: any }
  ) {
    return this.jobApplicationsService.rescoreApplication(id, body.approved_sections);
  }

  // SUGGEST BULLET TEMPLATES
  @Post(':id/resume/experience/suggest-bullets')
  @ApiBody({ schema: { properties: { experienceIndex: { type: 'number' } } } })
  suggestBulletTemplates(
    @Param('id') id: string,
    @Body() body: { experienceIndex: number }
  ) {
    return this.jobApplicationsService.suggestBulletTemplates(id, body.experienceIndex);
  }

  // REFINE SNAPSHOT
  @Post(':id/resume/snapshot/refine')
  @ApiBody({ schema: { properties: { 
    section: { type: 'string' }, 
    current_suggestion: { type: 'object' }, 
    instruction: { type: 'string' },
    preferences: { type: 'object' }
  } } })
  refineSnapshot(
    @Param('id') id: string,
    @Body() body: { section: string; current_suggestion: any; instruction: string; preferences?: any }
  ) {
    return this.jobApplicationsService.refineSnapshot(
      id, 
      body.section, 
      body.current_suggestion, 
      body.instruction, 
      body.preferences
    );
  }

  // PREVIEW SCORE - before creating application
  @Post('preview-score')
  @ApiBody({ schema: { properties: { 
    userId: { type: 'string' }, 
    jobId: { type: 'string' } 
  } } })
  previewScore(
    @Body() body: { userId: string; jobId: string }
  ) {
    return this.jobApplicationsService.previewScore(body.userId, body.jobId);
  }

  
}