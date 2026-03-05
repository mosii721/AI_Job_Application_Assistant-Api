import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecommendedJob } from './entities/recommended_job.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { UserPreference } from 'src/user_preferences/entities/user_preference.entity';
import { JobsService } from 'src/jobs/jobs.service';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class RecommendedJobsService {
  constructor(
    @InjectRepository(RecommendedJob) 
    private readonly recommendedJobRepository: Repository<RecommendedJob>,
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    @InjectRepository(Job) 
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(UserPreference)
    private readonly userPreferenceRepository: Repository<UserPreference>,
    private readonly jobsService: JobsService,
    private readonly httpService: HttpService,
  ) {}

  // CRON JOB - runs every 6 hours
  @Cron(CronExpression.EVERY_6_HOURS)
  async fetchAndRecommendJobs() {
    console.log('Running recommendation cron job...');

    // 1. get all active users with their preferences
    const users = await this.userRepository.find({
      where: { active: true },
      relations: ['preferences', 'masterProfile'],
    });

    for (const user of users) {
      if (!user.preferences) continue;

      try {
        // 2. fetch jobs from BrighterMonday and Remotive
        const [brighterMondayJobs, remotiveJobs] = await Promise.all([
          this.fetchFromBrighterMonday(user.preferences),
          this.fetchFromRemotive(user.preferences),
        ]);

        const allFetchedJobs = [...brighterMondayJobs, ...remotiveJobs];

        for (const fetchedJob of allFetchedJobs) {
          // 3. check if job already exists using url hash
          const duplicate = await this.jobsService.checkDuplicate(fetchedJob.url);

          let job: Job | null = null;

          if (duplicate.exists && duplicate.job_id) {
            const foundJob = await this.jobRepository.findOneBy({ id: duplicate.job_id });
            if (!foundJob) continue;
            job = foundJob;
          } else {
            const result = await this.jobsService.scrapeAndCreate(fetchedJob.url);
            job = result.job;
          }

          if (!job) continue;

          // 4. check if already recommended to this user
          const alreadyRecommended = await this.recommendedJobRepository.findOne({
            where: { userId: user.id, jobId: job.id },
          });
          if (alreadyRecommended) continue;

          // Skip scoring if profile data is missing
          if (!user.masterProfile?.structured_data_json || !job.job_embedding) {
            console.log(`Skipping scoring for user ${user.id} - missing profile or job embedding`);
            continue;
          }

          // 5. call AI for basic match score using embeddings
          const matchResponse = await firstValueFrom(
            this.httpService.post(`${process.env.AI_SERVICE_URL}/scoring/match`, {
              user_id: user.id,
              job_id: job.id,
              profile: user.masterProfile?.structured_data_json,
              job: job.structured_job_json,
              profile_embeddings: user.masterProfile?.resume_embedding,
              job_embeddings: job.job_embedding,
            })
          );
          const basicMatchScore = matchResponse.data.overall_score;

          // 6. save recommendation
          const recommendation = this.recommendedJobRepository.create({
            userId: user.id,
            jobId: job.id,
            basicMatchScore,
            isProcessed: false,
            sourceApi: fetchedJob.source,
          });
          await this.recommendedJobRepository.save(recommendation);
        }
      } catch (error) {
        console.error(`Failed to process recommendations for user ${user.id}:`, error);
        continue;
      }
    }

    console.log('Recommendation cron job completed');
  }

  // FETCH FROM BRIGHTERMONDAY - scrapes job listing page using Puppeteer
  private async fetchFromBrighterMonday(preferences: UserPreference): Promise<{ url: string; source: string }[]> {
  try {
    const role = preferences.preferredRoles[0] ?? 'developer';
    const location = preferences.locationPreference[0] ?? 'nairobi';

    const searchUrl = `${process.env.BRIGHTERMONDAY_BASE_URL}?q=${encodeURIComponent(role)}&l=${encodeURIComponent(location)}`;

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 30000,
    });

    const $ = cheerio.load(response.data);

    const jobUrls: string[] = [];

    $('a[href*="/listings/"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.includes('/listings/') && !href.includes('?') && !jobUrls.includes(href)) {
        const fullUrl = href.startsWith('http') ? href : `https://www.brightermonday.co.ke${href}`;
        jobUrls.push(fullUrl);
      }
    });

    return jobUrls.slice(0, 10).map(url => ({
      url,
      source: 'brightermonday',
    }));
  } catch (error) {
    console.error('BrighterMonday fetch failed:', error);
    return [];
  }
}

  // FETCH FROM REMOTIVE - API call for remote jobs
  private async fetchFromRemotive(preferences: UserPreference): Promise<{ url: string; source: string }[]> {
    try {
      const role = preferences.preferredRoles[0] ?? 'software developer';
      console.log('Fetching from Remotive with role:', role);
      console.log('Remotive URL:', process.env.REMOTIVE_BASE_URL);

      const response = await firstValueFrom(
        this.httpService.get(`${process.env.REMOTIVE_BASE_URL}`, {
          params: {
            search: role,
            limit: 10,
          },
        })
      );

      console.log('Remotive response jobs count:', response.data.jobs?.length);

      return response.data.jobs.map((job: any) => ({
        url: job.url,
        source: 'remotive',
      }));
    } catch (error) {
      console.error('Remotive fetch failed:', error);
      return [];
    }
  }

  // GET RECOMMENDATIONS FOR USER
  async findByUserId(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return await this.recommendedJobRepository.find({
      where: { userId },
      relations: ['job'],
      order: { basicMatchScore: 'DESC' },
    });
  }

  // MARK AS PROCESSED
  async markAsProcessed(userId: string, jobId: string) {
    const recommendation = await this.recommendedJobRepository.findOne({
      where: { userId, jobId },
      relations: ['job'],
    });

    if (!recommendation) {
      throw new NotFoundException(`Recommendation not found`);
    }

    await this.recommendedJobRepository.update(recommendation.id, {
      isProcessed: true,
    });

    return { processed: true, jobId };
  }

  // GET ALL - admin only
  async findAll() {
    return this.recommendedJobRepository.find({ relations: ['user', 'job'] });
  }

  // GET ONE
  async findOne(id: string) {
    const recommendation = await this.recommendedJobRepository.findOne({
      where: { id },
      relations: ['user', 'job'],
    });
    if (!recommendation) {
      throw new NotFoundException(`Recommendation with id ${id} not found`);
    }
    return recommendation;
  }

  // DELETE
  async remove(id: string) {
    await this.findOne(id);
    return await this.recommendedJobRepository.delete(id);
  }
}