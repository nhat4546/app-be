import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MoreThan, Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { AccountEntity } from 'src/modules/account/entities/account.entity';
import { MailService } from 'src/modules/mail/services/mail.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { RegisterInput } from '../dtos/auth-register-input.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}
  async register(input: RegisterInput) {
    try {
      const email = input.email.toLocaleLowerCase();
      const password = input.password;
      const isExistEmail = await this.userRepository.findOne({
        where: {
          email,
        },
      });
      if (isExistEmail) {
        throw new BadRequestException('EXIST_EMAIL');
      }
      const user = new UserEntity();
      const account = new AccountEntity();
      const date = new Date();

      date.setDate(date.getDate() + 1);
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      account.expireVerify = date;
      account.password = hash;
      account.token = crypto.randomBytes(32).toString('hex');
      await this.accountRepository.save(account);

      user.email = email;
      user.accountId = account.id;
      await this.userRepository.save(user);

      const confirm_url = `${this.configService.get('PUBLIC_URL')}/register/verify?code=${account.token}`;
      await this.mailService.sendMail(email, confirm_url);

      return {
        status: 200,
        message: 'REGISTER_ACCOUNT_SUCCESS',
      };
    } catch (errors) {
      console.log('ERRORS_REGISTER_ACCOUNT', errors);
      throw new BadRequestException(errors);
    }
  }

  async verifyRegister(code: string) {
    try {
      const account = await this.accountRepository.findOneBy({
        token: code,
        expireVerify: MoreThan(new Date()),
      });

      if (!account) {
        throw new NotFoundException('CODE_NOT_FOUND_OR_EXPIRED');
      }

      account.isVerify = true;
      account.token = null;
      account.expireVerify = null;
      await this.accountRepository.save(account);

      return {
        status: 200,
        message: 'VERIFY_REGISTER_SUCCESS',
      };
    } catch (error) {
      console.log('ERRORS_VERIFY_ACCOUNT', error);
      throw new BadRequestException(error);
    }
  }
}
