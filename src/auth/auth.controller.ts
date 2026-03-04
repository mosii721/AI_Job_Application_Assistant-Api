import { Controller, Get, Post, Body, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from './decorators/public.decorator';
import { AtGuard, RtGuard } from './guards';
import { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

interface RequestWithUser extends Request{
  user:{
    sub:string;
    email:string;
    refreshToken:string;
  }
}

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @UseGuards(AtGuard)
  @Get('logout/:id')
  async logout(@Param('id') id:string) {
    return await this.authService.logout(id);
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('refresh')
  refreshTokens(@Param('id') id: string,@Req() req:RequestWithUser) {
    const user = req.user;
    if(user.sub !== id){
      throw new UnauthorizedException('Id mismatch');
    }
    return this.authService.refreshTokens(id,user.refreshToken);
  }

  @Public()
  @ApiBody({ schema: { properties: { email: { type: 'string' } } } })
  @Post('request_password_change')
  async requestPasswordcChange(@Body('email') email:string){
    return await this.authService.requestPasswordChange(email);
  }

  @Public()
  @ApiBody({ 
    schema: { 
      properties: { 
        email: { type: 'string' },
        otp: { type: 'string' },
        newPassword: { type: 'string' }
      } 
    } 
  })
  @Post('verifyOtpAndUpdatePassword')
  async verifyOtpAndUpdatePassword(@Body('email')email:string, @Body('otp')otp:string, @Body('newPassword')newPassword:string){
    return await this.authService.verifyOtpAndUpdatePassword(email,otp,newPassword)
  }

}
