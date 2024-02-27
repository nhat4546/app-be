import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE } from 'src/modules/account/constants';
import { UserEntity } from 'src/modules/account/entities/user.entity';
import { ResponseFormat } from 'src/shared/common';
import { ILike, Repository } from 'typeorm';
import { CreateProjectInput } from '../dtos/create-project-input.dto';
import { ListProjectParams } from '../dtos/list-project-params';
import { ProjectEntity } from '../entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getProjectById(id: number) {
    try {
      const project = await this.projectRepository.findOneBy({ id });

      if (!project) {
        throw new NotFoundException('NOT_FOUND_PROJECT');
      }

      return project;
    } catch (error) {
      console.log('GET_PROJECT_FAIL', error);
      throw new BadRequestException(error);
    }
  }

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
      project.divisionManager = divisionManager;
      project.projectManager = projectManager;

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

  async listProject(input: ListProjectParams): Promise<ResponseFormat> {
    try {
      let query;
      if (input.projectName) {
        query = {
          where: {
            projectName: ILike(`%${input.projectName}%`),
          },
        };
      }

      const [list, total] = await this.projectRepository.findAndCount({
        take: input.limit,
        skip: input.limit * input.page,
        ...query,
      });

      return {
        status: 200,
        message: 'LIST_PROJECT_SUCCESS',
        data: list,
        pagination: {
          current_page: input.page + 1,
          last_page: Math.ceil(total / 10),
          per_page: 10,
          total,
        },
      };
    } catch (error) {
      console.log('LIST_PROJECT_FAIL', error);
      throw new BadRequestException(error);
    }
  }
}
