import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MasterProfilesService } from './master_profiles.service';
import { UpdateMasterProfileDto } from './dto/update-master_profile.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('master-profiles')
@ApiBearerAuth()
@Controller('master-profiles')
export class MasterProfilesController {
  constructor(private readonly masterProfilesService: MasterProfilesService) {}

  // GET ALL - admin only
  @Get()
  findAll() {
    return this.masterProfilesService.findAll();
  }


  // GET SKILLS
  @Get(':userId/skills')
  getSkills(@Param('userId') userId: string) {
    return this.masterProfilesService.getSkills(userId);
  }

  // ADD SKILL
  @Post(':userId/skills')
  @ApiBody({ schema: { properties: { name: { type: 'string' } } } })
  addSkill(
    @Param('userId') userId: string,
    @Body() body: { name: string }
  ) {
    return this.masterProfilesService.addSkill(userId, body.name);
  }

  // REMOVE SKILL
  @Delete(':userId/skills/:skillName')
  removeSkill(
    @Param('userId') userId: string,
    @Param('skillName') skillName: string
  ) {
    return this.masterProfilesService.removeSkill(userId, skillName);
  }

  // ADD EXPERIENCE
  @Post(':userId/experience')
  @ApiBody({ schema: { properties: { 
    company: { type: 'string' }, 
    role: { type: 'string' }, 
    start_date: { type: 'string' }, 
    end_date: { type: 'string' },
    is_current: { type: 'boolean' },
    industry: { type: 'string' },
    location: { type: 'string' },
    employment_type: { type: 'string' },
    bullets: { type: 'array', items: { type: 'string' } },
    duration_months: { type: 'number' },
    duration_estimated: { type: 'boolean' }
  } } })
  addExperience(
    @Param('userId') userId: string,
    @Body() body: { company: string; role: string; start_date?: string; end_date?: string; is_current?: boolean; industry?: string; location?: string; employment_type?: string; bullets?: string[]; duration_months?: number; duration_estimated?: boolean }
  ) {
    return this.masterProfilesService.addExperience(userId, body);
  }

  // UPDATE EXPERIENCE
  @Patch(':userId/experience/:index')
  @ApiBody({ schema: { properties: { 
    company: { type: 'string' }, 
    role: { type: 'string' }, 
    start_date: { type: 'string' }, 
    end_date: { type: 'string' },
    is_current: { type: 'boolean' },
    industry: { type: 'string' },
    location: { type: 'string' },
    employment_type: { type: 'string' },
    bullets: { type: 'array', items: { type: 'string' } },
    duration_months: { type: 'number' },
    duration_estimated: { type: 'boolean' }
  } } })
  updateExperience(
    @Param('userId') userId: string,
    @Param('index') index: string,
    @Body() body: { company?: string; role?: string; start_date?: string; end_date?: string; is_current?: boolean; industry?: string; location?: string; employment_type?: string; bullets?: string[]; duration_months?: number; duration_estimated?: boolean }
  ) {
    return this.masterProfilesService.updateExperience(userId, parseInt(index), body);
  }

  // REMOVE EXPERIENCE
  @Delete(':userId/experience/:index')
  removeExperience(
    @Param('userId') userId: string,
    @Param('index') index: string
  ) {
    return this.masterProfilesService.removeExperience(userId, parseInt(index));
  }

  // ADD EDUCATION
  @Post(':userId/education')
  @ApiBody({ schema: { properties: { 
    institution: { type: 'string' }, 
    degree: { type: 'string' },
    field: { type: 'string' },
    graduation_year: { type: 'number' },
    graduation_year_estimated: { type: 'boolean' },
    grade: { type: 'string' },
    relevant_coursework: { type: 'array', items: { type: 'string' } }
  } } })
  addEducation(
    @Param('userId') userId: string,
    @Body() body: { institution: string; degree: string; field?: string; graduation_year?: number; graduation_year_estimated?: boolean; grade?: string; relevant_coursework?: string[] }
  ) {
    return this.masterProfilesService.addEducation(userId, body);
  }

  // UPDATE EDUCATION
  @Patch(':userId/education/:index')
  @ApiBody({ schema: { properties: { 
    institution: { type: 'string' }, 
    degree: { type: 'string' },
    field: { type: 'string' },
    graduation_year: { type: 'number' },
    graduation_year_estimated: { type: 'boolean' },
    grade: { type: 'string' },
    relevant_coursework: { type: 'array', items: { type: 'string' } }
  } } })
  updateEducation(
    @Param('userId') userId: string,
    @Param('index') index: string,
    @Body() body: { institution: string; degree?: string; field?: string; graduation_year?: number; graduation_year_estimated?: boolean; grade?: string; relevant_coursework?: string[]  }
  ) {
    return this.masterProfilesService.updateEducation(userId, parseInt(index), body);
  }

  // REMOVE EDUCATION
  @Delete(':userId/education/:index')
  removeEducation(
    @Param('userId') userId: string,
    @Param('index') index: string
  ) {
    return this.masterProfilesService.removeEducation(userId, parseInt(index));
  }

  // GET VERSION HISTORY
  @Get(':userId/version-history')
  getVersionHistory(@Param('userId') userId: string) {
    return this.masterProfilesService.getVersionHistory(userId);
  }

   // REPLACE ENTIRE PROFILE
  // UPDATE ENTIRE PROFILE
  @Patch(':userId')
  replaceProfile(
    @Param('userId') userId: string,
    @Body() updateMasterProfileDto: UpdateMasterProfileDto) {
    return this.masterProfilesService.replaceProfile(userId, updateMasterProfileDto);
  }

  // UPDATE PERSONAL INFO
  @Patch(':userId/personal')
  @ApiBody({ schema: { properties: { 
    name: { type: 'string' }, 
    location: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    nationality: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    portfolio: { type: 'string' },
    website: { type: 'string' },
    photo_url: { type: 'string' }
  } } })
  updatePersonal(
    @Param('userId') userId: string,
    @Body() body: { name?: string; location?: string; email?: string; phone?: string; nationality?: string; linkedin?: string; github?: string; portfolio?: string; website?: string; photo_url?: string }
  ) {
    return this.masterProfilesService.updatePersonal(userId, body);
  }

  // DELETE
  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.masterProfilesService.removeByUserId(userId);
  }

// GET BY USER ID
  @Get(':userId')
  findByUserId(@Param('userId') userId: string) {
    return this.masterProfilesService.findByUserId(userId);
  }
}