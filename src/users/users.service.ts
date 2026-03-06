import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly userRepository:Repository<User>,
  private readonly mailService: MailService){}

  private async hashPassword(password:string):Promise<string>{
    const salt = await Bcrypt.genSalt(10);
    return Bcrypt.hash(password, salt)
  }

  async create(createUserDto: CreateUserDto):Promise<Partial<User>> {
    const existingUser = await this.userRepository.findOne({where:{email:createUserDto.email},select:['id']})

    if (existingUser){
      throw new Error('User with this email already exists');
    }

    const newUser: Partial<User> = {
      name: createUserDto.name,
      email: createUserDto.email,
      phone: createUserDto.phone,
      active: createUserDto.active ?? true,
      profile_photo: createUserDto.profile_photo,
      role: createUserDto.role,
      password: await this.hashPassword(createUserDto.password)
    }

    const savedUser = await this.userRepository.save(newUser)
  //   try {
  //   await this.mailService.sendLoginEmail(
  //     savedUser.email,
  //     savedUser.name,
  //   );
  // } catch (error) {
  //   console.error('Login email failed:', error);
  // }
    return savedUser;
  }

  async findAll(email?:string):Promise<Partial<User>[]> {
    let users:User[];
    if(email){
      users = await this.userRepository.find({
        where: {email},
        select:['id','name','email','phone','role','profile_photo','createdAt','updatedAt'],
        relations:['masterProfile','preferences','applications','documents','recommendations','suggestionFeedbacks']
      });
    }else{
      users = await this.userRepository.find({
        relations:['masterProfile','preferences','applications','documents','recommendations','suggestionFeedbacks']
      })
    }
    return users.map((user) => user);
  }

  async findOne(id: string) {
  return await this.userRepository.findOneBy({id}).then((user)=>{
      if(!user){
        return  `User  with  id  ${id} not found`
      }
      return  user;
    }).catch((error)=>{
      console.error('Error finding user:',error);
      throw new Error(`User  with  id  ${id} not found`);
    });;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await  this.userRepository.update(id,updateUserDto);
    return this.findOne(id)
  }

  async remove(id: string) {
    return await  this.userRepository.delete(id);
  }

  async updateActive(id: string, active: boolean) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  
    user.active = active;
    return await this.userRepository.save(user);
  }
}
