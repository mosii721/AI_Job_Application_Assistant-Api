import { Injectable } from '@nestjs/common';
import { CreateApplicationVersionDto } from './dto/create-application_version.dto';
import { UpdateApplicationVersionDto } from './dto/update-application_version.dto';

@Injectable()
export class ApplicationVersionsService {
  create(createApplicationVersionDto: CreateApplicationVersionDto) {
    return 'This action adds a new applicationVersion';
  }

  findAll() {
    return `This action returns all applicationVersions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} applicationVersion`;
  }

  update(id: number, updateApplicationVersionDto: UpdateApplicationVersionDto) {
    return `This action updates a #${id} applicationVersion`;
  }

  remove(id: number) {
    return `This action removes a #${id} applicationVersion`;
  }
}
