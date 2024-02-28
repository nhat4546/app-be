import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectService } from 'src/modules/project/services/project.service';
import { ResponseFormat } from 'src/shared/common';
import { Repository } from 'typeorm';
import { CreateOvertime } from '../dtos/overtime-req';
import { OverTimeEntity } from '../entities/overtime.entity';
import { AccountService } from 'src/modules/account/services/account.service';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';
import { OVER_TIME_STATUS } from '../constants';

@Injectable()
export class OvertimeService {
  constructor(
    @InjectRepository(OverTimeEntity)
    private overtimeRepository: Repository<OverTimeEntity>,
    @InjectRepository(OverTimeEntity)
    private projectRepository: Repository<ProjectEntity>,
    private projectService: ProjectService,
    private accountService: AccountService,
  ) {}

  async getMyOvertime(userId: number): Promise<ResponseFormat> {
    try {
      const listOvertime = await this.overtimeRepository
        .createQueryBuilder('ot')
        .leftJoinAndSelect('ot.project', 'p')
        .leftJoinAndSelect('p.projectManager', 'projectManager')
        .where('ot.userId = :userId', { userId })
        .getMany();

      return {
        status: 200,
        message: 'GET_LIST_MY_OVERTIME_SUCCESS',
        data: listOvertime,
      };
    } catch (error) {
      console.log('GET_LIST_MY_OVERTIME_FAIL', error);
      throw new BadRequestException(error);
    }
  }

  async getOvertimeById(id: number) {
    try {
      const overtime = await this.overtimeRepository.findOneBy({ id });

      if (!overtime) {
        throw new NotFoundException('NOT_FOUND_OVERTIME');
      }

      return overtime;
    } catch (error) {
      console.log('GET_OVERTIME_FAIL', error);
      throw new BadRequestException(error);
    }
  }

  async createOvertime(
    input: CreateOvertime,
    account: { id: number; email: string },
  ): Promise<ResponseFormat> {
    try {
      const project = await this.projectService.getProjectById(input.projectId);
      const user = await this.accountService.getAccountById(account.id);

      const overtime = new OverTimeEntity();
      overtime.project = project;
      overtime.user = user;
      overtime.hoursDuration = input.hoursDuration;
      overtime.reason = input.reason;
      overtime.description = input.description;

      await this.overtimeRepository.save(overtime);

      return {
        status: 200,
        message: 'CREATE_OVERTIME_SUCCESS',
        data: overtime,
      };
    } catch (error) {
      console.log('CREATE_OVERTIME_FAIL', error);
      throw new BadRequestException(error);
    }
  }

  async getRequestForPM(account: {
    id: number;
    email: string;
  }): Promise<ResponseFormat> {
    try {
      const listOvertime = await this.overtimeRepository
        .createQueryBuilder('ot')
        .leftJoinAndSelect('ot.user', 'u')
        .leftJoinAndSelect('ot.project', 'p')
        .where('p.projectManager = :id', { id: account.id })
        .getMany();

      return {
        status: 200,
        message: 'GET_REQUEST_OVERTIME_PM_SUCCESS',
        data: listOvertime,
      };
    } catch (error) {
      console.log('GET_REQUEST_OVERTIME_DM_FAIL', error);
      throw new BadRequestException(error);
    }
  }

  async PMAcceptRequest(
    pm: { id: number; email: string },
    idOvertime: number,
    isAccept: boolean,
  ): Promise<ResponseFormat> {
    try {
      const pmAccount = await this.accountService.getAccountById(pm.id);
      if (!pmAccount) {
        throw new NotFoundException('NOT_FOUND_ACCOUNT');
      }

      const overtime = await this.overtimeRepository
        .createQueryBuilder('ot')
        .leftJoinAndSelect('ot.project', 'p')
        .where('p.projectManager = :id', { id: pm.id })
        .where('ot.id = :id', { id: idOvertime })
        .getOne();

      if (!overtime) {
        throw new NotFoundException('NOT_FOUND_OVERTIME');
      }
      overtime.status = isAccept
        ? OVER_TIME_STATUS.CONFIRMED
        : OVER_TIME_STATUS.CANCEL;

      await this.overtimeRepository.save(overtime);

      return {
        status: 200,
        message: 'UPDATE_OVERTIME_PM_SUCCESS',
        data: overtime,
      };
    } catch (error) {
      console.log('UPDATE_OVERTIME_PM_FAIL', error);
      throw new BadRequestException(error);
    }
  }

  async getRequestForDM(account: {
    id: number;
    email: string;
  }): Promise<ResponseFormat> {
    try {
      const listOvertime = await this.overtimeRepository
        .createQueryBuilder('ot')
        .leftJoinAndSelect('ot.user', 'u')
        .leftJoinAndSelect('ot.project', 'p')
        .where('p.divisionManager = :id', { id: account.id })
        .getMany();

      return {
        status: 200,
        message: 'GET_REQUEST_OVERTIME_DM_SUCCESS',
        data: listOvertime,
      };
    } catch (error) {
      console.log('GET_REQUEST_OVERTIME_DM_FAIL', error);
      throw new BadRequestException(error);
    }
  }
}
