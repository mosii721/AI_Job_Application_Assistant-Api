import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  // THIS IS THE ONLY PART THAT REALLY CHANGES
  private async sendMail(to: string, subject: string, text: string) {
    const apiKey = this.configService.getOrThrow<string>('MAILERSEND_API_KEY');
    const domain = this.configService.getOrThrow<string>('MAILERSEND_DOMAIN');

    try {
      const response = await fetch('https://api.mailersend.com/v1/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          // The "from" MUST use your test domain
          from: { 
            email: `info@${domain}`, 
            name: "Job Application Assistant" 
          },
          to: [{ email: to }],
          subject: subject,
          text: text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`MailerSend error: ${JSON.stringify(errorData)}`);
      }

      console.log(`Email to ${to} sent successfully!`);
    } catch (error) {
      console.error(`Error sending ${subject}:`, error);
      throw error;
    }
  }

  // ALL THESE METHODS STAY THE SAME AS BEFORE
  async sendLoginEmail(to: string, name: string) {
    const subject = 'Login Notification';
    const text = `Hello ${name},\n\nYou have successfully logged in to your account.`;
    return this.sendMail(to, subject, text);
  }

  async sendRegistrationEmail(to: string, name: string) {
    const subject = 'Welcome to Ai Job Application Assistant!';
    const text = `Hi ${name},\n\nYou have been registered.`;
    return this.sendMail(to, subject, text);
  }

  async sendOtpEmail(to: string, name: string, otp: string) {
    const subject = 'Password Change Request';
    const text = `Hi ${name},\n\nOTP: ${otp}`;
    return this.sendMail(to, subject, text);
  }

  async sendPasswordChangeConfirmation(to: string, name: string) {
    const subject = 'Password Changed Successfully';
    const text = `Hi ${name},\n\nYour password has been changed.`;
    return this.sendMail(to, subject, text);
  }
}