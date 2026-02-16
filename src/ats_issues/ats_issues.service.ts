import { Injectable } from '@nestjs/common';
import { CreateAtsIssueDto } from './dto/create-ats_issue.dto';
import { UpdateAtsIssueDto } from './dto/update-ats_issue.dto';

@Injectable()
export class AtsIssuesService {
  create(createAtsIssueDto: CreateAtsIssueDto) {
    return 'This action adds a new atsIssue';
  }

  findAll() {
    return `This action returns all atsIssues`;
  }

  findOne(id: number) {
    return `This action returns a #${id} atsIssue`;
  }

  update(id: number, updateAtsIssueDto: UpdateAtsIssueDto) {
    return `This action updates a #${id} atsIssue`;
  }

  remove(id: number) {
    return `This action removes a #${id} atsIssue`;
  }
}
