import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../account/entities/account.entity';
import { CheckingInformationEntity } from '../account/entities/checking-information.entity';
import { UserEntity } from '../account/entities/user.entity';
import { CheckingInformationService } from '../account/services/checking-information.service';
import { MailService } from '../mail/services/mail.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    MailService,
    JwtService,
    CheckingInformationService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AccountEntity,
      CheckingInformationEntity,
    ]),
  ],
})
export class AuthModule {}
