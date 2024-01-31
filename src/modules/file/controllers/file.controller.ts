import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'path';

@ApiTags('files')
@Controller('files')
export class FileController {
  @Get('/:file')
  getFile(@Res() res: Response, @Param('file') file: string) {
    try {
      return res.sendFile(
        path.join(
          process.cwd(),
          `${process.env.UPLOADED_FILES_DESTINATION}/${file}`,
        ),
      );
    } catch (error) {
      console.log('GET_FILE_ERROR', error);
      throw new BadRequestException(error);
    }
  }
}
