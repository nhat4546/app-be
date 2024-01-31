import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { AccountService } from '../services/account.service';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}
  @UseGuards(AuthGuard)
  @Get()
  async getDetailAccount(@Request() req) {
    return await this.accountService.getDetailAccount(req.account);
  }
}
