import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MasterProfilesService } from './master_profiles.service';
import { CreateMasterProfileDto } from './dto/create-master_profile.dto';
import { UpdateMasterProfileDto } from './dto/update-master_profile.dto';

@Controller('master-profiles')
export class MasterProfilesController {
  constructor(private readonly masterProfilesService: MasterProfilesService) {}

  @Post()
  create(@Body() createMasterProfileDto: CreateMasterProfileDto) {
    return this.masterProfilesService.create(createMasterProfileDto);
  }

  @Get()
  findAll() {
    return this.masterProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterProfilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMasterProfileDto: UpdateMasterProfileDto) {
    return this.masterProfilesService.update(+id, updateMasterProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterProfilesService.remove(+id);
  }
}
