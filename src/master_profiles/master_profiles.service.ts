import { Injectable } from '@nestjs/common';
import { CreateMasterProfileDto } from './dto/create-master_profile.dto';
import { UpdateMasterProfileDto } from './dto/update-master_profile.dto';

@Injectable()
export class MasterProfilesService {
  create(createMasterProfileDto: CreateMasterProfileDto) {
    return 'This action adds a new masterProfile';
  }

  findAll() {
    return `This action returns all masterProfiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} masterProfile`;
  }

  update(id: number, updateMasterProfileDto: UpdateMasterProfileDto) {
    return `This action updates a #${id} masterProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} masterProfile`;
  }
}
