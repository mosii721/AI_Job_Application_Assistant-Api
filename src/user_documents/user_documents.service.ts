import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDocumentDto } from './dto/create-user_document.dto';
import { UpdateUserDocumentDto } from './dto/update-user_document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {  UserDocument } from './entities/user_document.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserDocumentsService {
  constructor(
    @InjectRepository(UserDocument) private readonly userDocumentRepository: Repository<UserDocument>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDocumentDto: CreateUserDocumentDto) {
    const existUser = await this.userRepository.findOneBy({ id: createUserDocumentDto.userId });

    if(!existUser){
      throw new NotFoundException(`User with id ${createUserDocumentDto.userId} not found`);
    }

    const newUserDocument = this.userDocumentRepository.create({
      user: existUser,
      name: createUserDocumentDto.name,
      fileUrl: createUserDocumentDto.fileUrl,
      pageCount: createUserDocumentDto.pageCount,
      fileSizeKb: createUserDocumentDto.fileSizeKb,
      certificateName: createUserDocumentDto.certificateName,
      issuingOrg: createUserDocumentDto.issuingOrg,
      issueDate: createUserDocumentDto.issueDate,
      expiryDate: createUserDocumentDto.expiryDate,
      documentType: createUserDocumentDto.documentType,
    })
    return this.userDocumentRepository.save(newUserDocument);
  }

  async findAll() {
    return this.userDocumentRepository.find({relations:['user','applicationDocuments']});
  }

  async findOne(id: string) {
    return await this.userDocumentRepository.findOne({where: {id}, relations:['user','applicationDocuments']});
  }

  async update(id: string, updateUserDocumentDto: UpdateUserDocumentDto) {
    return await this.userDocumentRepository.update(id, updateUserDocumentDto);
  }

  async remove(id: string) {
    return await this.userDocumentRepository.delete(id);
  }
}
