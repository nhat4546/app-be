import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { CreateOvertime } from '../dtos/overtime-req';
import { OvertimeService } from '../services/overtime.service';

@ApiTags('overtime')
@Controller('overtime')
export class OvertimeController {
  constructor(private overtimeService: OvertimeService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getMyOvertime(
    @Request() req: { account: { id: number; email: string } },
  ) {
    return await this.overtimeService.getMyOvertime(req?.account?.id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createOvertime(
    @Body() input: CreateOvertime,
    @Request() req: { account: { id: number; email: string } },
  ) {
    return await this.overtimeService.createOvertime(input, req?.account);
  }
}
