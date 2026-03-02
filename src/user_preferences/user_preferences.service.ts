import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserPreferenceDto } from './dto/create-user_preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user_preference.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPreference } from './entities/user_preference.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectRepository(UserPreference) private readonly userPreferenceRepository: Repository<UserPreference>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserPreferenceDto: CreateUserPreferenceDto) {
      const existUser = await this.userRepository.findOneBy({ id: createUserPreferenceDto.userId });

      if(!existUser){
        throw new NotFoundException(`User with id ${createUserPreferenceDto.userId} not found`);
      }

      const newUserPreference = this.userPreferenceRepository.create({
        user: existUser,
        preferredRoles: createUserPreferenceDto.preferredRoles,
        industries: createUserPreferenceDto.industries,
        experienceLevel: createUserPreferenceDto.experienceLevel,
        locationPreference: createUserPreferenceDto.locationPreference,
        jobType: createUserPreferenceDto.jobType,
        salaryMin: createUserPreferenceDto.salaryMin,
        salaryMax: createUserPreferenceDto.salaryMax,
        salaryCurrency: createUserPreferenceDto.salaryCurrency,
      })
    return this.userPreferenceRepository.save(newUserPreference);
  }

  async findAll() {
    return this.userPreferenceRepository.find({relations:['user']});
  }

  async findByUserId(userId: string) {
    const preference = await this.userPreferenceRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!preference) {
      throw new NotFoundException(`Preferences for user ${userId} not found`);
    }
    return preference;
  }

  async update(id: string, updateUserPreferenceDto: UpdateUserPreferenceDto) {
    return await this.userPreferenceRepository.update(id, updateUserPreferenceDto);
  }

  async removeByUserId(userId: string) {
  const preference = await this.findByUserId(userId);
  return await this.userPreferenceRepository.delete(preference.id);
}
}
