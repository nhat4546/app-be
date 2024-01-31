import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../account/entities/account.entity';
import { MailService } from '../mail/services/mail.service';
import { UserEntity } from '../user/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ConfigService, MailService, JwtService],
  imports: [TypeOrmModule.forFeature([UserEntity, AccountEntity])],
})
export class AuthModule {}
