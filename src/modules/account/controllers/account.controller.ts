import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { AccountEditInput } from '../dtos/account-edit-input.dto';
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

  @UseGuards(AuthGuard)
  @Post('edit')
  @ApiConsumes('multipart/form-data')
  // @UseInterceptors(
  //   FileFieldsInterceptor([{ name: 'file', maxCount: 1 }], {
  //     storage: diskStorage({
  //       destination: (_, __, callback) => {
  //         // Synchronously retrieve the environment variable
  //         const destinationPath =
  //           process.env.UPLOADED_FILES_DESTINATION || 'images';

  //         if (!destinationPath) {
  //           return callback(
  //             new Error('UPLOADED_FILES_DESTINATION is not set'),
  //             '',
  //           );
  //         }

  //         // Ensure the destination directory exists
  //         if (!existsSync(destinationPath)) {
  //           mkdirSync(destinationPath, { recursive: true });
  //         }

  //         // Call the callback with the final destination path
  //         callback(null, destinationPath);
  //       },
  //       filename: (req, file, callback) => {
  //         const originName = path.parse(file.originalname).name;
  //         const ext = path.extname(file.originalname);
  //         const filename = `${Date.now()}-${originName}${ext}`;
  //         callback(null, filename);
  //       },
  //     }),
  //     limits: {
  //       fileSize: 50 * 1024 * 1024,
  //     },
  //     fileFilter(req, file, cb) {
  //       if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
  //         // Allow storage of file
  //         cb(null, true);
  //       } else {
  //         // Reject file
  //         cb(
  //           new BadRequestException(
  //             `Unsupported file type ${file.originalname}`,
  //           ),
  //           false,
  //         );
  //       }
  //     },
  //   }),
  // )
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_, __, callback) => {
          // Synchronously retrieve the environment variable
          const destinationPath = process.env.UPLOADED_FILES_DESTINATION;

          if (!destinationPath) {
            return callback(
              new Error('UPLOADED_FILES_DESTINATION is not set'),
              '',
            );
          }

          // Ensure the destination directory exists
          if (!existsSync(destinationPath)) {
            mkdirSync(destinationPath, { recursive: true });
          }

          // Call the callback with the final destination path
          callback(null, destinationPath);
        },
        filename: (req, file, callback) => {
          const originName = path.parse(file.originalname).name;
          const ext = path.extname(file.originalname);
          const filename = `${Date.now()}-${originName}${ext}`;
          callback(null, filename);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
      fileFilter(req, file, cb) {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new BadRequestException(
              `Unsupported file type ${file.originalname}`,
            ),
            false,
          );
        }
      },
    }),
  )
  async editProfile(
    @Body() body: AccountEditInput,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return await this.accountService.editProfile(req.account, body, file?.path);
  }
}
