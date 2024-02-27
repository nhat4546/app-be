import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../account/entities/user.entity';
import { ProjectController } from './controllers/project.controller';
import { ProjectEntity } from './entities/project.entity';
import { ProjectService } from './services/project.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProjectController],
  providers: [JwtService, ProjectService],
  imports: [TypeOrmModule.forFeature([ProjectEntity, UserEntity])],
  exports: [],
})
export class ProjectModule {}
