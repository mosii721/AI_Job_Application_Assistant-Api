import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter;
  constructor(private readonly configService: ConfigService){
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth:{
        user: this.configService.getOrThrow<string>('EMAIL_USER'),
        pass: this.configService.getOrThrow<string>('EMAIL_PASS'),
      },
    })
  }


  async sendLoginEmail(to: string, name: string){
    const mailOptions = {
      from: `"Ai Job Application Assistant"<${this.configService.getOrThrow<string>('EMAIL_USER')}>`,
      to: to,
      subject: 'Login Notification',
      text: `Hello ${name},\n\nYou have successfully logged in to your account.\n\nIf you did not perform this action, please contact support immediately.\n\nBest regards,\nYour Ai Job Application Assistant Team`,
    };

    try{
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Login email sent: ', info.response);
      return info;
    }catch(error){
      console.error('Error sending login email: ', error);
      throw error;
    }
  }

async sendRegistrationEmail(to: string, name: string) {
  const mailOptions = {
    from: `"Ai Job Application Assistant" <${this.configService.get<string>('EMAIL_USER')}>`,
    to,
    subject: 'Welcome to Ai Job Application Assistant!',
    text: `Hi ${name},

You have been registered on our Ai Job Application Assistant App.

Thank you for joining us! We are excited to have you on board and look forward to helping you with your job applications.

If you believe this message was sent to you in error, please contact our support team through this email.

Best regards,
The Ai Job Application Assistant Team`,
  };

  try {
    const info = await this.transporter.sendMail(mailOptions);
    console.log('Registration email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw error;
  }
}

  async sendOtpEmail(to:string,name:string,otp:string){
    const mailOptions = {
    from: `"Ai Job Application Assistant" <${this.configService.get<string>('EMAIL_USER')}>`,
    to,
    subject: 'Password Change Request',
    text: `Hi ${name},

You have requested to change your password.

Use the code below to verify your request:
OTP: ${otp}

This code will expire in 10 minutes. 
If you did not request this change, please ignore this email.

Best regards,
The Ai Job Application Assistant Team`,
  };

  try {
    const info = await this.transporter.sendMail(mailOptions);
    console.log('OTP email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
}

async sendPasswordChangeConfirmation(to: string, name: string) {
  const mailOptions = {
    from: `"Ai Job Application Assistant" <${this.configService.get<string>('EMAIL_USER')}>`,
    to,
    subject: 'Password Changed Successfully',
    text: `Hi ${name},

Your password has been changed successfully. 
If you did not perform this action, contact our support team immediately.

Best regards,
The Ai Job Application Assistant Team`,
  };

  try {
    await this.transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password change confirmation email:', error);
  }
}

}
