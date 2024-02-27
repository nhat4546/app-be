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

@Injectable()
export class OvertimeService {
  constructor(
    @InjectRepository(OverTimeEntity)
    private overtimeRepository: Repository<OverTimeEntity>,
    private projectService: ProjectService,
    private accountService: AccountService,
  ) {}

  async getMyOvertime(userId: number): Promise<ResponseFormat> {
    try {
      const listOvertime = await this.overtimeRepository
        .createQueryBuilder('ot')
        // .leftJoinAndSelect('ot.user', 'user')
        .leftJoinAndSelect('ot.project', 'project')
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
}
