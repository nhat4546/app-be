import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../account/entities/account.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';

@Module({
  controllers: [AccountController],
  providers: [JwtService, AccountService],
  imports: [TypeOrmModule.forFeature([UserEntity, AccountEntity])],
})
export class AccountModule {}
