import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { ApproveOvertime, CreateOvertime } from '../dtos/overtime-req';
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

  @Get('/request-for-pm')
  @UseGuards(AuthGuard)
  async getRequestForPM(
    @Request() req: { account: { id: number; email: string } },
  ) {
    return await this.overtimeService.getRequestForPM(req?.account);
  }

  @Post('/pm-accept-request/:id')
  @UseGuards(AuthGuard)
  async PMAcceptRequest(
    @Request() req: { account: { id: number; email: string } },
    @Param('id') id: number,
    @Body() input: ApproveOvertime,
  ) {
    return await this.overtimeService.PMAcceptRequest(
      req?.account,
      +id,
      input.isAccept,
    );
  }

  @Get('/request-for-dm')
  @UseGuards(AuthGuard)
  async getRequestForDM(
    @Request() req: { account: { id: number; email: string } },
  ) {
    return await this.overtimeService.getRequestForDM(req?.account);
  }
}
