import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMasterProfileDto } from './dto/update-master_profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterProfile } from './entities/master_profile.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MasterProfilesService {
  constructor(
    @InjectRepository(MasterProfile) 
    private readonly masterProfileRepository: Repository<MasterProfile>,
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
  ) {}

  // CREATE - called internally after resume upload and AI processing
  // not called directly by frontend
  async createFromResumeUpload(userId: string, rawText: string, preParsed: {
  name?: string;
  email?: string;
  phone?: string;
  found_skills?: string[];
  sections?: { experience?: string; education?: string; skills?: string; };
}) {
  const user = await this.userRepository.findOneBy({ id: userId });
  if (!user) {
    throw new NotFoundException(`User with id ${userId} not found`);
  }

  // check if profile already exists to get profile_id and version
  const existingProfile = await this.masterProfileRepository.findOneBy({ userId });

  const profileId = existingProfile?.id ?? userId; // use existing id or userId as placeholder
  const version = existingProfile ? existingProfile.version_number + 1 : 1;

  // 1. call AI to parse resume - endpoint is /resume/parse
  const enhanceResponse = await firstValueFrom(
    this.httpService.post(`${process.env.AI_SERVICE_URL}/resume/parse`, {
      user_id: userId,
      profile_id: profileId,
      version,
      raw_text: rawText,
      pre_parsed: preParsed,
    })
  );
  const structuredData = enhanceResponse.data; // AI returns structured data directly

  // 2. call AI to generate embedding for the resume
  const embeddingResponse = await firstValueFrom(
    this.httpService.post(`${process.env.AI_SERVICE_URL}/generate-embedding`, {
      text: rawText,
      type: 'resume',
    })
  );
  const embedding = embeddingResponse.data.embedding;

  if (existingProfile) {
    // update existing profile and increment version
    await this.masterProfileRepository.update(existingProfile.id, {
      structured_data_json: structuredData,
      resume_embedding: embedding,
      version_number: version,
    });
    return this.masterProfileRepository.findOneBy({ userId });
  }

  // create new master profile
  const newMasterProfile = this.masterProfileRepository.create({
    userId,
    version_number: 1,
    structured_data_json: structuredData,
    resume_embedding: embedding,
  });

  return await this.masterProfileRepository.save(newMasterProfile);
}
  // GET ALL - admin only
  async findAll() {
    return await this.masterProfileRepository.find({ relations: ['user'] });
  }

  // GET BY USER ID - frontend uses this not by profile id
  async findByUserId(userId: string) {
    const profile = await this.masterProfileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(`Master profile for user ${userId} not found`);
    }
    return profile;
  }

  // GET ONE BY PROFILE ID
  async findOne(id: string) {
    const profile = await this.masterProfileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(`Master profile with id ${id} not found`);
    }
    return profile;
  }

  // GET SKILLS - GET /master-profile/:userId/skills
  async getSkills(userId: string) {
    const profile = await this.findByUserId(userId);
    return { skills: profile.structured_data_json.skills ?? [] };
  }

  // ADD SKILL - POST /master-profile/:userId/skills
  async addSkill(userId: string, skill: string) {
    const profile = await this.findByUserId(userId);

    const currentSkills = profile.structured_data_json?.skills ?? [];

    if (currentSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      throw new ConflictException(`Skill ${skill} already exists`);
    }

    const updatedData = {
      ...profile.structured_data_json,
      skills: [...currentSkills, skill],
    };

    await this.masterProfileRepository.update(profile.id, {
      structured_data_json: updatedData,
      version_number: profile.version_number + 1,
    });

    return this.getSkills(userId);
  }

  // REMOVE SKILL - DELETE /master-profile/:userId/skills/:skillName
  async removeSkill(userId: string, skillName: string) {
    const profile = await this.findByUserId(userId);

    const updatedSkills = (profile.structured_data_json.skills ?? [])
      .filter(skill => skill !== skillName);

    const updatedData = {
      ...profile.structured_data_json,
      skills: updatedSkills,
    };

    await this.masterProfileRepository.update(profile.id, {
      structured_data_json: updatedData,
      version_number: profile.version_number + 1,
    });

    return this.getSkills(userId);
  }

  // ADD EXPERIENCE - POST /master-profile/:userId/experience
  async addExperience(userId: string, experience: {
    company: string;
    job_title: string;
    start_date: string;
    end_date?: string;
    description: string;
  }) {
    const profile = await this.findByUserId(userId);

    const currentExperience = profile.structured_data_json.experience ?? [];

    const updatedData = {
      ...profile.structured_data_json,
      experience: [...currentExperience, experience],
    };

    await this.masterProfileRepository.update(profile.id, {
      structured_data_json: updatedData,
      version_number: profile.version_number + 1,
    });

    return this.findByUserId(userId);
  }

  // UPDATE EXPERIENCE - PATCH /master-profile/:userId/experience/:index
  async updateExperience(userId: string, index: number, experience: {
    company?: string;
    job_title?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
  }) {
    const profile = await this.findByUserId(userId);

    const currentExperience = [...(profile.structured_data_json.experience ?? [])];
    if (index < 0 || index >= currentExperience.length) {
      throw new NotFoundException(`Experience at index ${index} not found`);
    }

    currentExperience[index] = {
      ...currentExperience[index],
      ...experience,
    };

    await this.masterProfileRepository.update(profile.id, {
      structured_data_json: {
        ...profile.structured_data_json,
        experience: currentExperience,
      },
      version_number: profile.version_number + 1,
    });

    return this.findByUserId(userId);
  }

  // REMOVE EXPERIENCE - DELETE /master-profile/:userId/experience/:index
  async removeExperience(userId: string, index: number) {
    const profile = await this.findByUserId(userId);

    const currentExperience = [...(profile.structured_data_json.experience ?? [])];
    if (index < 0 || index >= currentExperience.length) {
      throw new NotFoundException(`Experience at index ${index} not found`);
    }

    currentExperience.splice(index, 1);

    await this.masterProfileRepository.update(profile.id, {
      structured_data_json: {
        ...profile.structured_data_json,
        experience: currentExperience,
      },
      version_number: profile.version_number + 1,
    });

    return this.findByUserId(userId);
  }

  // ADD EDUCATION - POST /master-profile/:userId/education
  async addEducation(userId: string, education: {
    institution: string;
    degree: string;
    start_date: string;
    end_date?: string;
  }) {
    const profile = await this.findByUserId(userId);

    const currentEducation = profile.structured_data_json.education ?? [];

    const updatedData = {
      ...profile.structured_data_json,
      education: [...currentEducation, education],
    };

    await this.masterProfileRepository.update(profile.id, {
      structured_data_json: updatedData,
      version_number: profile.version_number + 1,
    });

    return this.findByUserId(userId);
  }

  // UPDATE EDUCATION - PATCH /master-profile/:userId/education/:index
  async updateEducation(userId: string, index: number, education: {
    institution?: string;
    degree?: string;
    start_date?: string;
    end_date?: string;
  }) {
    const profile = await this.findByUserId(userId);

    const currentEducation = [...(profile.structured_data_json.education ?? [])];
    if (index < 0 || index >= currentEducation.length) {
      throw new NotFoundException(`Education at index ${index} not found`);
    }

    currentEducation[index] = {
      ...currentEducation[index],
      ...education,
    };

    await this.masterProfileRepository.update(profile.id, {
      structured_data_json: {
        ...profile.structured_data_json,
        education: currentEducation,
      },
      version_number: profile.version_number + 1,
    });

    return this.findByUserId(userId);
  }

  // REMOVE EDUCATION - DELETE /master-profile/:userId/education/:index
  async removeEducation(userId: string, index: number) {
    const profile = await this.findByUserId(userId);

    const currentEducation = [...(profile.structured_data_json.education ?? [])];
    if (index < 0 || index >= currentEducation.length) {
      throw new NotFoundException(`Education at index ${index} not found`);
    }

    currentEducation.splice(index, 1);

    await this.masterProfileRepository.update(profile.id, {
      structured_data_json: {
        ...profile.structured_data_json,
        education: currentEducation,
      },
      version_number: profile.version_number + 1,
    });

    return this.findByUserId(userId);
  }

  // UPDATE ENTIRE PROFILE - PATCH /master-profile/:userId
// increments version and regenerates embedding
async replaceProfile(userId: string, updateMasterProfileDto: UpdateMasterProfileDto) {
  const profile = await this.findByUserId(userId);

  const embeddingResponse = await firstValueFrom(
    this.httpService.post(`${process.env.AI_SERVICE_URL}/generate-embedding`, {
      text: JSON.stringify(updateMasterProfileDto.structured_data_json),
      type: 'resume',
    })
  );
  const embedding = embeddingResponse.data.embedding;

  await this.masterProfileRepository.update(profile.id, {
    structured_data_json: updateMasterProfileDto.structured_data_json,
    resume_embedding: embedding,
    version_number: profile.version_number + 1,
  });

  return this.findByUserId(userId);
}
  // GET VERSION HISTORY - GET /master-profile/:userId/version-history
  // version number is tracked on the profile itself
  async getVersionHistory(userId: string) {
    const profile = await this.findByUserId(userId);
    return {
      current_version: profile.version_number,
      userId: profile.userId,
      last_updated: profile.updatedAt,
    };
  }

  // DELETE BY USER ID
  async removeByUserId(userId: string) {
  const profile = await this.findByUserId(userId); // this already throws if not found
  return await this.masterProfileRepository.delete(profile.id);
}
}