import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ConfigModule], // not necceessary since it is global in app.module but it is here for clarity
  providers: [MailService]
})
export class MailModule {}
