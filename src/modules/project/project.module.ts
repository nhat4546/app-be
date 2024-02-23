import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { ProjectController } from './controllers/project.controller';
import { JwtService } from '@nestjs/jwt';
import { ProjectService } from './services/project.service';
import { UserEntity } from '../account/entities/user.entity';

@Module({
  controllers: [ProjectController],
  providers: [JwtService, ProjectService],
  imports: [TypeOrmModule.forFeature([ProjectEntity, UserEntity])],
  exports: [],
})
export class ProjectModule {}
