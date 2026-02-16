import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { RolesGuard } from 'src/auth/guards';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, MailService,RolesGuard],
})
export class UsersModule {}
