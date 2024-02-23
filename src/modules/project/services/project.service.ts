import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/account/entities/user.entity';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../entities/project.entity';
import { CreateProjectInput } from '../dtos/create-project-input.dto';
import { ResponseFormat } from 'src/shared/common';
import { ROLE } from 'src/modules/account/constants';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async createProject(input: CreateProjectInput): Promise<ResponseFormat> {
    try {
      const divisionManager = await this.userRepository.findOne({
        where: {
          id: input.divisionManagerId,
          role: ROLE.DIVISION_MANAGER,
        },
      });

      if (!divisionManager) {
        throw new NotFoundException('NOT_FOUND_DIVISION_MANAGER');
      }

      const projectManager = await this.userRepository.findOne({
        where: {
          id: input.projectManagerId,
          role: ROLE.PROJECT_MANAGE,
        },
      });

      if (!projectManager) {
        throw new NotFoundException('NOT_FOUND_PROJECT_MANAGER');
      }

      const project = new ProjectEntity();
      project.projectName = input.projectName;
      project.divisionManager = input.divisionManagerId;
      project.projectManager = input.projectManagerId;

      await this.projectRepository.save(project);

      return {
        status: 200,
        message: 'CREATE_PROJECT_SUCCESS',
        data: project,
      };
    } catch (error) {
      console.log('CREATE_PROJECT_FAIL', error);
      throw new BadRequestException(error);
    }
  }
}
