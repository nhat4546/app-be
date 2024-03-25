import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MoreThan, Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccountEntity } from 'src/modules/account/entities/account.entity';
import { UserEntity } from 'src/modules/account/entities/user.entity';
import { MailService } from 'src/modules/mail/services/mail.service';
import { LoginInput } from '../dtos/auth-login-input.dto';

import { CheckingInformationService } from 'src/modules/account/services/checking-information.service';
import { ResponseFormat } from 'src/shared/common';
import { RegisterInput } from '../dtos/auth-register-input.dto';
import { TokenEntity } from '../entities/token.entity';
import { RefreshTokenInput } from '../dtos/auth-refresh-token.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
    private mailService: MailService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private checkingInformationService: CheckingInformationService,
  ) {}

  handleResponseLogin(payload: { id: number; email: string }) {
    const access_time = this.configService.get('JWT_ACCESS_TOKEN_EXPIRE_TIME');
    const refresh_time = this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRE_TIME',
    );
    const accessToken = this.jwtService.sign(payload, {
      privateKey: this.configService.get('JWT_ACCESS_TOKEN'),
      expiresIn: Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRE_TIME')),
    });
    const refreshToken = this.jwtService.sign(payload, {
      privateKey: this.configService.get('JWT_REFRESH_TOKEN'),
      expiresIn: Number(
        this.configService.get('JWT_REFRESH_TOKEN_EXPIRE_TIME'),
      ),
    });
    const time = new Date();
    const expiredAccess = new Date(+time.getTime() + +access_time);
    const expiredRefresh = new Date(+time.getTime() + +refresh_time);
    return { accessToken, refreshToken, expiredAccess, expiredRefresh };
  }

  async register(input: RegisterInput): Promise<ResponseFormat> {
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
      user.role = input.role;
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

  async verifyRegister(code: string): Promise<ResponseFormat> {
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

  async login(input: LoginInput): Promise<ResponseFormat> {
    try {
      const email = input.email.toLowerCase();
      const password = input.password;

      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new BadRequestException('EMAIL_OR_PASSWORD_INCORRECT');
      }

      const account = await this.accountRepository.findOneBy({
        id: user.id,
      });
      if (!account) {
        throw new BadRequestException('EMAIL_OR_PASSWORD_INCORRECT');
      }

      const isMatch = bcrypt.compareSync(password, account.password);
      if (!isMatch) {
        throw new BadRequestException('EMAIL_OR_PASSWORD_INCORRECT');
      }

      // update check in - check out
      await this.checkingInformationService.updateCheckingCheckout(account.id);

      const data = this.handleResponseLogin({
        id: account.id,
        email: user.email,
      });

      const tokenEntity = await this.tokenRepository.findOneBy({
        id: account.id,
      });
      if (tokenEntity) {
        tokenEntity.refreshToken = data.refreshToken;
        await this.tokenRepository.save(tokenEntity);
      }
      if (!tokenEntity) {
        const newToken = new TokenEntity();
        newToken.userId = account.id;
        newToken.refreshToken = data.refreshToken;
        await this.tokenRepository.save(newToken);
      }

      return {
        status: 200,
        message: 'LOGIN_SUCCESS',
        data,
      };
    } catch (error) {
      console.log('LOGIN_FAIL', error);
      throw new BadRequestException(error);
    }
  }

  async refreshToken(input: RefreshTokenInput): Promise<ResponseFormat> {
    try {
      const payload = await this.jwtService.verifyAsync(input.refreshToken, {
        secret: this.configService.get('JWT_REFRESH_TOKEN'),
      });

      const user = await this.userRepository.findOneBy({
        id: payload.id,
      });
      if (!user) {
        throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
      }

      const token = await this.tokenRepository.findOneBy({
        refreshToken: input.refreshToken,
      });
      if (!token) {
        throw new UnauthorizedException('UNAUTHORIZED', 'UNAUTHORIZED');
      }

      const data = this.handleResponseLogin({
        id: user.id,
        email: user.email,
      });

      token.refreshToken = data.refreshToken;
      await this.tokenRepository.save(token);

      return {
        status: 200,
        message: 'REFRESH_TOKEN_SUCCESS',
        data,
      };
    } catch (error) {
      console.log('ERRORS_REFRESH_TOKEN', error);
      throw new BadRequestException(error);
    }
  }
}
