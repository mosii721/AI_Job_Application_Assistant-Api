import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository, Like } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import * as puppeteer from 'puppeteer';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) 
    private readonly jobRepository: Repository<Job>,
    private readonly httpService: HttpService,
  ) {}

  // HASH URL - private helper
  private hashUrl(url: string): string {
    return crypto.createHash('sha256').update(url).digest('hex');
  }

  private validateUrl(url: string): void {
    if (!url) {
        throw new BadRequestException('URL is required');
    }

    try {
        const parsed = new URL(url); // built into Node.js, no library needed
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            throw new BadRequestException('URL must use http or https');
        }
    } catch {
        throw new BadRequestException('Invalid job URL');
    }
}

  // SCRAPE JOB PAGE - private helper using Puppeteer
  private async scrapeJobPage(url: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // needed for linux/docker
    });

    try {
      const page = await browser.newPage();

      // set user agent to avoid bot detection
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      );

      await page.goto(url, { 
        waitUntil: 'networkidle2', // wait until page fully loads
        timeout: 30000 
      });

      // extract all visible text from the page
      const rawText = await page.evaluate(() => {
        // remove script and style tags first
        const scripts = document.querySelectorAll('script, style');
        scripts.forEach(el => el.remove());
        return document.body.innerText;
      });

      return rawText;
    } catch (error) {
      throw new BadRequestException(`Failed to scrape job page: ${error.message}`);
    } finally {
      await browser.close(); // always close browser
    }
  }

  // CHECK DUPLICATE - POST /jobs/check-duplicate
  async checkDuplicate(url: string) {
    this.validateUrl(url);
    const urlHash = this.hashUrl(url);
    const existingJob = await this.jobRepository.findOne({ 
      where: { url_hash: urlHash } 
    });

    return {
      exists: !!existingJob,
      job_id: existingJob?.id ?? null,
    };
  }

  // SCRAPE AND CREATE JOB - POST /jobs/scrape
  // this is the main endpoint - frontend sends URL, backend does everything
  async scrapeAndCreate(url: string) {

    this.validateUrl(url);
    
    // 1. hash the url
    const urlHash = this.hashUrl(url);

    // 2. check if job already exists
    const existingJob = await this.jobRepository.findOne({ 
      where: { url_hash: urlHash } 
    });

    // 3. if exists return immediately - free and instant
    if (existingJob) {
      return {
        job_id: existingJob.id,
        job: existingJob,
        from_cache: true,
      };
    }

    // 4. scrape the job page
    const rawText = await this.scrapeJobPage(url);

    // 5. call AI to extract structured job requirements from raw text
    const structureResponse = await firstValueFrom(
      this.httpService.post(`${process.env.AI_SERVICE_URL}/extract-job-requirements`, {
        raw_text: rawText,
        url,
      })
    );
    const structuredJob = structureResponse.data;

    // 6. call AI to generate embedding for the job
    const embeddingResponse = await firstValueFrom(
      this.httpService.post(`${process.env.AI_SERVICE_URL}/generate-embedding`, {
        text: rawText,
        type: 'job',
      })
    );
    const jobEmbedding = embeddingResponse.data.embedding;

    // 7. save job to database
    const newJob = this.jobRepository.create({
      title: structuredJob.title,
      company: structuredJob.company,
      location: structuredJob.location,
      raw_description: rawText,
      structured_job_json: structuredJob,
      job_embedding: jobEmbedding,
      source_url: url,
      url_hash: urlHash,
    });

    await this.jobRepository.save(newJob);

    return {
      job_id: newJob.id,
      job: newJob,
      from_cache: false,
    };
  }

  // GET ALL - admin only with optional filters
  async findAll(title?: string, company?: string, location?: string) {
    const where: any = {};

    if (title) where.title = Like(`%${title}%`);
    if (company) where.company = Like(`%${company}%`);
    if (location) where.location = Like(`%${location}%`);

    return await this.jobRepository.find({
      where,
      relations: ['applications', 'recommendations'],
    });
  }

  // GET ONE
  async findOne(id: string) {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['applications', 'recommendations'],
    });

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    return job;
  }

  // SEARCH JOBS - POST /jobs/search
  // basic filtering as per documentation
  async search(query: {
    query?: string;
    filters?: {
      location?: string;
      role?: string;
      mode?: string;
    };
  }) {
    const where: any = {};

    if (query.filters?.location) {
      where.location = Like(`%${query.filters.location}%`);
    }
    if (query.filters?.role) {
      where.title = Like(`%${query.filters.role}%`);
    }
    if (query.query) {
      where.title = Like(`%${query.query}%`);
    }

    const jobs = await this.jobRepository.find({
      where,
      relations: ['applications', 'recommendations'],
    });

    return {
      jobs,
      count: jobs.length,
    };
  }

  // UPDATE - backend only, not exposed to frontend
  async update(id: string, updateJobDto: UpdateJobDto) {
    await this.findOne(id); // check exists first
    return await this.jobRepository.update(id, updateJobDto);
  }

  // DELETE
  async remove(id: string) {
    await this.findOne(id); // check exists first
    return await this.jobRepository.delete(id);
  }
}