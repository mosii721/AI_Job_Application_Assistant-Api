import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as Bcrypt from 'bcrypt';
import { randomInt } from 'crypto';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepository:Repository<User>,
  private readonly mailService: MailService,
  private readonly configService: ConfigService,
  private readonly jwtService: JwtService){}

  private async getTokens(userId:string, email:string, role:string){
    const [at,rt] = await Promise.all([ // generate both tokens in at the same time
      this.jwtService.signAsync({sub:userId ,email:email,role:role},{ // creates a signed access token which expires in 15 mins
        secret: this.configService.getOrThrow<string>(
          'JWT_AT_SECRET'
        ),
        expiresIn: this.configService.getOrThrow(
          'JWT_AT_EXPIRES_IN'
        ),
      }),
      this.jwtService.signAsync({
        sub: userId,
        email: email,
        role: role,
      },{
        secret: this.configService.getOrThrow<string>(
          'JWT_RT_SECRET'
        ),
        expiresIn: this.configService.getOrThrow(
          'JWT_RT_EXPIRES_IN'
        ),
      })
    ]);

    return{
      access_token: at,
      refresh_token: rt,
    }
  }

   private async hashToken(token:string):Promise<string>{ // hash the rt before saving to db
    const salt = await Bcrypt.genSalt(10);
    return Bcrypt.hash(token,salt)
  }

  private async saveRefreshToken(userId:string, rt:string):Promise<void>{
    const hashedRefreshToken = await this.hashToken(rt);
    await this.userRepository.update(userId,{
      hashedRefreshToken: hashedRefreshToken,
    })
  }

  async login(createAuthDto:CreateAuthDto){
    const foundUser = await this.userRepository.findOne({where:{email:createAuthDto.email},
    select:['id','email','role','password','active','name']});

    if(!foundUser){
      throw new NotFoundException(`User with email ${createAuthDto.email} not found`);
    };

    if(!foundUser.active){
      throw new ForbiddenException('Your account is inactive please contact support')
    }

    const foundPassword = await Bcrypt.compare(createAuthDto.password, foundUser.password);

    if(!foundPassword){
      throw new NotFoundException('Invalid password');
    }

    const {access_token, refresh_token} = await this.getTokens(
      foundUser.id,
      foundUser.email,
      foundUser.role
    )

    await this.saveRefreshToken(foundUser.id, refresh_token);
    await this.mailService.sendLoginEmail(foundUser.email, foundUser.name);

    return{data:{tokens:{access_token, refresh_token},
    user:{
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
      active: foundUser.active,
      name: foundUser.name,
    }}}
  }


  async logout(userId:string){
    const foundUser = await this.userRepository.findOne({where:{id:userId},select:['id','hashedRefreshToken','email']});

    if(!foundUser){
      throw new NotFoundException(`User with id not found`);
    }

    await this.userRepository.update(userId,{
      hashedRefreshToken: null,
    });

    return {message: 'logged out successfully'};
  }

  async refreshTokens(userId:string, refreshToken:string){
    const foundUser = await this.userRepository.findOne({where:{id:userId},select:['id','hashedRefreshToken','email','role','name']});

    if(!foundUser){
      throw new NotFoundException(`User with id not found`);
    }

    if(!foundUser.hashedRefreshToken){
      throw new NotFoundException('User has no refresh token');
  }

  const isRefreshTokenValid = await Bcrypt.compare(refreshToken,foundUser.hashedRefreshToken);
  if(!isRefreshTokenValid){
    throw new NotFoundException('Refresh token is invalid');
  }

  const {access_token, refresh_token:newRefreshToken} = await this.getTokens(foundUser.id,foundUser.email,foundUser.role);

  await this.saveRefreshToken(foundUser.id, newRefreshToken);
  return {access_token,refreshToken:newRefreshToken}
}

  async requestPasswordChange(email:string){
    const user = await this.userRepository.findOne({where:{email}});

    if(!user){
      throw new NotFoundException(`User with ${email} not found`)
    }

    const otp = randomInt(100000, 999999).toString();// generate 6 digit otp

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes()+ 10)// set expiry eg 10 minutes

    user.otpCode = otp;
    user.otpExpiry = expiry;

    await this.userRepository.save(user);

    await this.mailService.sendOtpEmail(user.email,user.name,otp)

    return { message: 'OTP sent to your email. It expires in 10 minutes.' };
  }

  async verifyOtpAndUpdatePassword(email:string, otp:string,newpassword:string){
    const user = await this.userRepository.findOne({where:{email}});

    if (!user || !user.otpCode || !user.otpExpiry){
      throw new NotFoundException('No OTP Found for this user')
    }

    if(new Date() > user.otpExpiry ){
      throw new Error('OTP Expired')
    }

    if(user.otpCode !== otp){
      throw new Error('Invalid otp')
    }

    const salt = await Bcrypt.genSalt(10)
    user.password = await Bcrypt.hash(newpassword,salt);
    user.otpCode = null;
    user.otpExpiry = null

    await this.userRepository.save(user);
    await this.mailService.sendPasswordChangeConfirmation(user.email,user.name);
    return { message: 'Password changed successfully.' };

  }
}
