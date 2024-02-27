import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OvertimeController } from './controllers/overtime.controller';
import { OverTimeEntity } from './entities/overtime.entity';
import { OvertimeService } from './services/overtime.service';
import { ProjectService } from '../project/services/project.service';
import { ProjectEntity } from '../project/entities/project.entity';
import { UserEntity } from '../account/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account/services/account.service';
import { AccountEntity } from '../account/entities/account.entity';

@Module({
  controllers: [OvertimeController],
  providers: [JwtService, OvertimeService, ProjectService, AccountService],
  imports: [
    TypeOrmModule.forFeature([
      OverTimeEntity,
      ProjectEntity,
      UserEntity,
      AccountEntity,
    ]),
  ],
  exports: [],
})
export class OverTimeModule {}
