import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ResponseFormat } from 'src/shared/common';
import { Repository } from 'typeorm';
import { AccountDetailOutput } from '../dtos/account-detail-output.dto';
import { AccountEditInput } from '../dtos/account-edit-input.dto';
import { AccountEntity } from '../entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async getAccountById(id: number) {
    const account = await this.userRepository.findOne({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('ACCOUNT_NOT_FOUND');
    }

    return plainToClass(AccountDetailOutput, account, {
      excludeExtraneousValues: true,
    });
  }

  async getAccountByEmail(email: string) {
    const account = await this.userRepository.findOne({
      where: { email },
    });

    if (!account) {
      throw new NotFoundException('ACCOUNT_NOT_FOUND');
    }

    return plainToClass(AccountDetailOutput, account, {
      excludeExtraneousValues: true,
    });
  }

  async getDetailAccount(req: {
    id: number;
    email: string;
  }): Promise<ResponseFormat> {
    try {
      const account = await this.getAccountById(req.id);

      return {
        status: 200,
        message: 'GET_ACCOUNT_SUCCESS',
        data: account,
      };
    } catch (error) {
      console.log('GET_ACCOUNT_FAIL', error);
      throw new BadRequestException(error);
    }
  }

  async editProfile(
    acc: { id: number; email: string },
    req: AccountEditInput,
    filePath: string,
  ): Promise<ResponseFormat> {
    try {
      const account = await this.getAccountById(acc.id);
      account.avatarUrl = filePath || null;
      account.user_name = req.userName || null;
      await this.accountRepository.save(account);

      return {
        status: 200,
        message: 'EDIT_ACCOUNT_SUCCESS',
        data: plainToClass(AccountDetailOutput, account, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      console.log('EDIT_PROFILE_FAIL', error);
      throw new BadRequestException(error);
    }
  }
}
