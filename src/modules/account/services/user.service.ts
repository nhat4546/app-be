import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/account/entities/user.entity';
import { ResponseFormat } from 'src/shared/common';
import { Repository } from 'typeorm';
import { ROLE } from '../constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getListDivisionManager(): Promise<ResponseFormat> {
    try {
      const list = await this.userRepository.find({
        where: {
          role: ROLE.DIVISION_MANAGER,
        },
      });

      const formatList = list.map((item) => ({
        id: item.id,
        userName: item.userName,
      }));

      return {
        message: 'GET_LIST_DIVISION_MANAGER_SUCCESS',
        status: 200,
        data: formatList,
      };
    } catch (error) {
      console.log('GET_LIST_DIVISION_MANAGER_FAIL', error);
      throw new BadRequestException(error);
    }
  }

  async getListProjectManager() {
    try {
      const list = await this.userRepository.find({
        where: {
          role: ROLE.PROJECT_MANAGE,
        },
      });

      const formatList = list.map((item) => ({
        id: item.id,
        userName: item.userName,
      }));

      return {
        message: 'GET_LIST_PROJECT_MANAGER_SUCCESS',
        status: 200,
        data: formatList,
      };
    } catch (error) {
      console.log('GET_LIST_PROJECT_MANAGER_FAIL', error);
      throw new BadRequestException(error);
    }
  }
}
