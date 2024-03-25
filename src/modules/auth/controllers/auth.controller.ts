import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { LoginInput } from '../dtos/auth-login-input.dto';
import { RegisterInput } from '../dtos/auth-register-input.dto';
import { AuthService } from '../services/auth.service';
import { RefreshTokenInput } from '../dtos/auth-refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  async register(@Body() body: RegisterInput) {
    return await this.authService.register(body);
  }

  @Get('/register/verify/:code')
  @ApiParam({ name: 'code', required: true })
  async verifyRegister(@Param() params: { code: string }) {
    return await this.authService.verifyRegister(params.code);
  }

  @Post('/login')
  async login(@Body() body: LoginInput) {
    return await this.authService.login(body);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() body: RefreshTokenInput) {
    return await this.authService.refreshToken(body);
  }
}
