import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { UserService } from '../services/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(AuthGuard)
  @Get('/list-division-manager')
  async getListDivisionManager() {
    return await this.userService.getListDivisionManager();
  }

  // @UseGuards(AuthGuard)
  @Get('/list-project-manager')
  async getListProjectManager() {
    return await this.userService.getListProjectManager();
  }
}
