import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMasterProfileDto } from './dto/create-master_profile.dto';
import { UpdateMasterProfileDto } from './dto/update-master_profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterProfile } from './entities/master_profile.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MasterProfilesService {
  constructor(
    @InjectRepository(MasterProfile) private readonly masterProfileRepository: Repository<MasterProfile>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createMasterProfileDto: CreateMasterProfileDto) {
    const existUser = await this.userRepository.findOneBy({ id: createMasterProfileDto.userId });

    if(!existUser){
      throw new NotFoundException(`User with id ${createMasterProfileDto.userId} not found`);
    }

    const newMasterProfile = this.masterProfileRepository.create({
      user: existUser,
      version_number: createMasterProfileDto.version_number,
      structured_data_json: createMasterProfileDto.structured_data_json,
      resume_embedding: createMasterProfileDto.resume_embedding,
    })
    return this.masterProfileRepository.save(newMasterProfile);
  }

  async findAll() {
    return await this.masterProfileRepository.find({relations:['user']});
  }

  async findOne(id: string) {
    return await this.masterProfileRepository.findOne({where: {id}, relations:['user']});
  }

  async update(id: string, updateMasterProfileDto: UpdateMasterProfileDto) {
    return await this.masterProfileRepository.update(id, updateMasterProfileDto);
  }

  async remove(id: string) {
    return await this.masterProfileRepository.delete(id);
  }
}
