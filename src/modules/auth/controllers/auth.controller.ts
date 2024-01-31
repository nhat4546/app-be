import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterInput } from '../dtos/auth-register-input.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  async register(@Body() body: RegisterInput) {
    return await this.authService.register(body);
  }

  @Get('/register/verify/:code')
  async verifyRegister(@Param() params: { code: string }) {
    return await this.authService.verifyRegister(params.code);
  }
}
