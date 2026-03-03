import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateJobApplicationDto } from './dto/update-job_application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplication, ApplicationStatus } from './entities/job_application.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { MasterProfile } from 'src/master_profiles/entities/master_profile.entity';
import { ApplicationTimeline, EventType } from 'src/application_timelines/entities/application_timeline.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ApplicationVersion, ContentType, CreatedBy } from 'src/application_versions/entities/application_version.entity';
import { SuggestionAction, SuggestionContentType, SuggestionFeedback } from 'src/suggestion_feedbacks/entities/suggestion_feedback.entity';

@Injectable()
export class JobApplicationsService {
  constructor(
    @InjectRepository(JobApplication) 
    private readonly jobApplicationRepository: Repository<JobApplication>,
    
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(Job) 
    private readonly jobRepository: Repository<Job>,
    
    @InjectRepository(MasterProfile) 
    private readonly masterProfileRepository: Repository<MasterProfile>,
    
    @InjectRepository(ApplicationTimeline) 
    private readonly timelineRepository: Repository<ApplicationTimeline>,

    @InjectRepository(ApplicationVersion) private readonly applicationVersionRepository: Repository<ApplicationVersion>,
    @InjectRepository(SuggestionFeedback) private readonly suggestionFeedbackRepository: Repository<SuggestionFeedback>,
    
    private readonly httpService: HttpService, // for calling AI service
  ) {}

  // CREATE - frontend only sends userId and jobId
  // backend does everything else automatically
  async create(userId: string, jobId: string) {
    // 1. check user exists
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // 2. check job exists
    const job = await this.jobRepository.findOneBy({ id: jobId });
    if (!job) {
      throw new NotFoundException(`Job with id ${jobId} not found`);
    }

    const existingApplication = await this.jobApplicationRepository.findOneBy({userId,jobId,});

    if (existingApplication) {
      throw new ConflictException('Application already exists for this job');
    }
    // 3. get user's master profile - needed to copy into tailored data
    const masterProfile = await this.masterProfileRepository.findOneBy({ userId });
    if (!masterProfile) {
      throw new NotFoundException(`Master profile for user ${userId} not found`);
    }

    // 4. call AI service to compute match scores and analysis
    const matchResponse = await firstValueFrom(
      this.httpService.post(`${process.env.AI_SERVICE_URL}/scoring/match`, {
        user_id: userId,
        job_id: jobId,
        profile: masterProfile.structured_data_json,
        job: job.structured_job_json,
        profile_embeddings: masterProfile.resume_embedding,
        job_embeddings: job.job_embedding,
      })
    );
    const matchData = matchResponse.data;

    // 5. create application with master profile copied into tailored data
    const newJobApplication = this.jobApplicationRepository.create({
      userId,
      jobId,
      profileVersionUsed: masterProfile.version_number,
      overallMatchScore: matchData.overall_score,
      skillScore: matchData.breakdown?.skills ?? 0,
      experienceScore: matchData.breakdown?.experience ?? 0,
      educationScore: matchData.breakdown?.seniority ?? 0,  // AI has no education score, using seniority
      matchAnalysisJson: matchData,
      tailoredResumeJson: masterProfile.structured_data_json,
      status: ApplicationStatus.DRAFT,
    });

    const saved = await this.jobApplicationRepository.save(newJobApplication);

    // 6. create first timeline event
    const timelineEvent = this.timelineRepository.create({
      applicationId: saved.id,
      eventType: EventType.STATUS_CHANGE,
      previousStatus: ApplicationStatus.DRAFT,
      newStatus: ApplicationStatus.DRAFT,
      notes: 'Application created',
    });
    await this.timelineRepository.save(timelineEvent);

    return saved;
  }

  // GET ALL applications for a specific user
  async findByUser(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return await this.jobApplicationRepository.find({
      where: { userId },
      relations: ['job', 'versions', 'timeline', 'documents'],
    });
  }

  // GET ONE application by id
  async findOne(id: string) {
    const application = await this.jobApplicationRepository.findOne({
      where: { id },
      relations: ['user', 'job', 'versions', 'timeline', 'documents', 'suggestionFeedbacks'],
    });

    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    return application;
  }

  // AUTO-SAVE tailored data edits from workspace
  async updateTailoredData(id: string, section: string, newValue: any) {
    const application = await this.findOne(id);

    // only update the specific section that changed
    const updatedTailoredData = {
      ...application.tailoredResumeJson,
      [section]: newValue,
    };

    await this.jobApplicationRepository.update(id, {
      tailoredResumeJson: updatedTailoredData,
    });

    return { saved: true, updatedAt: new Date() };
  }

  // UPDATE STATUS - also creates a timeline event automatically
  async updateStatus(id: string, newStatus: ApplicationStatus, notes?: string) {
    const application = await this.findOne(id);
    const previousStatus = application.status;

    // update the status
    await this.jobApplicationRepository.update(id, { status: newStatus });

    // automatically create timeline event
    const timelineEvent = this.timelineRepository.create({
      applicationId: id,
      eventType: EventType.STATUS_CHANGE,
      previousStatus,
      newStatus,
      notes,
    });
    await this.timelineRepository.save(timelineEvent);

    return { updated: true, previousStatus, newStatus };
  }

  // FINALIZE - lock in all edits, mark as ready to apply
  async finalize(id: string) {
    const application = await this.findOne(id);

    await this.jobApplicationRepository.update(id, {
      status: ApplicationStatus.READY_TO_APPLY,
    });


    // create timeline event for finalization
    const timelineEvent = this.timelineRepository.create({
      applicationId: id,
      eventType: EventType.STATUS_CHANGE,
      previousStatus: application.status,
      newStatus: ApplicationStatus.READY_TO_APPLY,
      notes: 'Application finalized and ready to apply',
    });
    await this.timelineRepository.save(timelineEvent);

    return {
      finalized: true,
      resumeUrl: application.resumeFileUrl,
      coverLetterReady: !!application.coverLetterCurrent,
      emailReady: !!application.emailSubject && !!application.emailBody,
    };
  }

  // GENERAL UPDATE - for misc field updates
  async update(id: string, updateJobApplicationDto: UpdateJobApplicationDto) {
    return await this.jobApplicationRepository.update(id, updateJobApplicationDto);
  }

  // DELETE
  async remove(id: string) {
    await this.findOne(id); // check exists first
    return await this.jobApplicationRepository.delete(id);
  }

  // GET ALL - admin only
async findAll() {
  return await this.jobApplicationRepository.find({
    relations: ['user', 'job', 'versions', 'timeline', 'documents', 'suggestionFeedbacks'],
  });
}

// GENERATE COVER LETTER - calls AI service
async generateCoverLetter(id: string, preferences: { tone?: string; length?: string; emphasize?: string[] }) {
  const application = await this.findOne(id);
  const masterProfile = await this.masterProfileRepository.findOneBy({ userId: application.userId });
  const job = await this.jobRepository.findOneBy({ id: application.jobId });

  if(!masterProfile) {
    throw new NotFoundException(`Master Profile not Found`)
  }

  if(!job) {
    throw new NotFoundException(`Job not Found`)
  }

  // call AI service
  const response = await firstValueFrom(
    this.httpService.post(`${process.env.AI_SERVICE_URL}/cover-letter/generate`, {
      user_id: application.userId,
      job_id: application.jobId,
      profile: masterProfile.structured_data_json,
      job: job.structured_job_json,
      preferences,
    })
  );

  const coverLetter = response.data.draft;

  // save to application
  await this.jobApplicationRepository.update(id, {
    coverLetterCurrent: coverLetter,
    coverLetterPreferencesJson: preferences as any,
  });

  // save version snapshot
  await this.saveVersion(id, 'cover_letter', coverLetter, 'ai');

  // create timeline event
  await this.timelineRepository.save(
    this.timelineRepository.create({
      applicationId: id,
      eventType: EventType.COVER_LETTER_GENERATED,
      previousStatus: application.status,
      newStatus: application.status,
      notes: 'Cover letter generated by AI',
    })
  );

  return { cover_letter: coverLetter, word_count: coverLetter.split(' ').length };
}

// UPDATE COVER LETTER MANUALLY
async updateCoverLetter(id: string, content: string) {

  await this.jobApplicationRepository.update(id, { coverLetterCurrent: content });

  // save version snapshot
  await this.saveVersion(id, 'cover_letter', content, 'user');

  return { updated: true, updatedAt: new Date() };
}

// REFINE COVER LETTER
async refineCoverLetter(id: string, feedback: string, constraints?: { max_words?: number }) {
  const application = await this.findOne(id);

  // call AI service
  const response = await firstValueFrom(
    this.httpService.post(`${process.env.AI_SERVICE_URL}/cover-letter/refine`, {
      user_id: application.userId,
      job_id: application.jobId,
      current_draft: application.coverLetterCurrent,
      instruction: feedback,
      preferences: constraints,
    })
  );

  const refinedContent = response.data.draft;

  // save refined version
  await this.jobApplicationRepository.update(id, { coverLetterCurrent: refinedContent });

  // save version snapshot
  await this.saveVersion(id, 'cover_letter', refinedContent, 'ai_refinement');

  return { cover_letter: refinedContent };
}

// REVERT COVER LETTER TO PREVIOUS VERSION
async revertCoverLetter(id: string, version: number) {
  // get all cover letter versions for this application
  const versions = await this.applicationVersionRepository.find({
    where: { applicationId: id, contentType: ContentType.COVER_LETTER },
    order: { createdAt: 'ASC' },
  });

  // find the requested version (1-indexed)
  const targetVersion = versions[version - 1];
  if (!targetVersion) {
    throw new NotFoundException(`Version ${version} not found`);
  }

  // save as new version with reverted content
  await this.jobApplicationRepository.update(id, { 
    coverLetterCurrent: targetVersion.contentData 
  });
  await this.saveVersion(id, 'cover_letter', targetVersion.contentData, 'reverted');

  return { reverted_to: version, cover_letter: targetVersion.contentData };
}

// GENERATE EMAIL - calls AI service
async generateEmail(id: string, options: { tone?: string; include_cover_letter?: boolean }) {
  const application = await this.findOne(id);
  const job = await this.jobRepository.findOneBy({ id: application.jobId });
  const user = await this.userRepository.findOneBy({ id: application.userId });

  if(!job){
    throw new NotFoundException(`Job not Found`)
  }

  if(!user){
    throw new NotFoundException(`User not Found`)
  }

  // call AI service
  const masterProfile = await this.masterProfileRepository.findOneBy({ userId: application.userId });

  const response = await firstValueFrom(
    this.httpService.post(`${process.env.AI_SERVICE_URL}/email/generate`, {
      user_id: application.userId,
      job_id: application.jobId,
      email_id: crypto.randomUUID(),
      profile: masterProfile?.structured_data_json,
      job: job.structured_job_json,
      cover_letter: options.include_cover_letter ? application.coverLetterCurrent : null,
      preferences: {
        email_type: 'short_intro',
        tone: options.tone ?? 'professional',
        addressee: 'Hiring Manager',
        include_subject: true,
      },
    })
  );

  const { subject } = response.data;
  const body = response.data.draft;

  // save to application
  await this.jobApplicationRepository.update(id, {
    emailSubject: subject,
    emailBody: body,
  });

  // create timeline event
  await this.timelineRepository.save(
    this.timelineRepository.create({
      applicationId: id,
      eventType: EventType.EMAIL_GENERATED,
      previousStatus: application.status,
      newStatus: application.status,
      notes: 'Application email generated by AI',
    })
  );

  return { subject, body };
}

// UPDATE EMAIL MANUALLY
async updateEmail(id: string, data: { subject?: string; body?: string }) {
  await this.findOne(id);
  await this.jobApplicationRepository.update(id, {
    emailSubject: data.subject,
    emailBody: data.body,
  });
  return { updated: true, updatedAt: new Date() };
}

// GET MATCH ANALYSIS
async getMatchAnalysis(id: string) {
  const application = await this.findOne(id);
  return application.matchAnalysisJson;
}

// GET VERSION HISTORY
async getVersionHistory(id: string) {
  await this.findOne(id);
  return await this.applicationVersionRepository.find({
    where: { applicationId: id },
    order: { createdAt: 'ASC' },
  });
}

// GET TIMELINE
async getTimeline(id: string) {
  await this.findOne(id);
  return await this.timelineRepository.find({
    where: { applicationId: id },
    order: { eventDate: 'ASC' },
  });
}

// HELPER - save a version snapshot
private async saveVersion(
  applicationId: string,
  contentType: string,
  contentData: string,
  createdBy: string
) {
  const version = this.applicationVersionRepository.create({
    applicationId,
    contentType: contentType as ContentType,
    contentData,
    created_by: createdBy as CreatedBy,
  });
  return await this.applicationVersionRepository.save(version);
}

// SUGGEST RESUME BULLET IMPROVEMENTS - calls AI service
async suggestBulletImprovements(id: string, bulletIndex: number, experienceIndex: number) {
  const application = await this.findOne(id);

  const experience = application.tailoredResumeJson.experience;
  if (!experience || !experience[experienceIndex]) {
    throw new NotFoundException(`Experience at index ${experienceIndex} not found`);
  }

  const bullet = experience[experienceIndex].description;

  // call AI service
  const response = await firstValueFrom(
    this.httpService.post(`${process.env.AI_SERVICE_URL}/suggest-improvements`, {
      content_type: 'resume_bullet',
      content: bullet,
      job_context: application.matchAnalysisJson,
    })
  );

  return {
    original: bullet,
    suggestions: response.data.suggestions,
    experienceIndex,
  };
}

// UPDATE RESUME BULLET - after user accepts a suggestion
async updateResumeBullet(
  id: string,
  experienceIndex: number,
  newDescription: string,
  action: SuggestionAction,
  originalContent: string,
  suggestedContent: string,
) {
  const application = await this.findOne(id);

  if (action === SuggestionAction.ACCEPT) {
    // update the bullet in tailored resume
    const currentExperience = [...(application.tailoredResumeJson.experience ?? [])];
    if (experienceIndex < 0 || experienceIndex >= currentExperience.length) {
      throw new NotFoundException(`Experience at index ${experienceIndex} not found`);
    }

    currentExperience[experienceIndex] = {
      ...currentExperience[experienceIndex],
      description: newDescription,
    };

    await this.jobApplicationRepository.update(id, {
      tailoredResumeJson: {
        ...application.tailoredResumeJson,
        experience: currentExperience,
      },
    });

    // save version snapshot
    await this.saveVersion(id, ContentType.RESUME_BULLET, newDescription, CreatedBy.AI_REFINEMENT);
  }

  // save feedback regardless of action - AI uses this to learn
  await this.suggestionFeedbackRepository.save(
    this.suggestionFeedbackRepository.create({
      userId: application.userId,
      applicationId: id,
      contentType: SuggestionContentType.BULLET,
      originalContent,
      suggestedContent,
      action,
    })
  );

  return { updated: action === SuggestionAction.ACCEPT, action };
}

// GENERATE PDF RESUME - returns data for frontend to render
async generatePdf(id: string) {
  const application = await this.findOne(id);
  const user = await this.userRepository.findOneBy({ id: application.userId });

  if (!user) {
    throw new NotFoundException(`User not found`);
  }

  // create timeline event
  await this.timelineRepository.save(
    this.timelineRepository.create({
      applicationId: id,
      eventType: EventType.RESUME_DOWNLOADED,
      previousStatus: application.status,
      newStatus: application.status,
      notes: 'Resume PDF generated',
    })
  );

  return {
    resume_data: application.tailoredResumeJson,
    user_name: user.name,
    application_id: id,
  };
}

// PREVIEW PDF - returns data for frontend to render
async previewPdf(id: string) {
  const application = await this.findOne(id);
  const user = await this.userRepository.findOneBy({ id: application.userId });

  if (!user) {
    throw new NotFoundException(`User not found`);
  }

  return {
    resume_data: application.tailoredResumeJson,
    user_name: user.name,
  };
}
}