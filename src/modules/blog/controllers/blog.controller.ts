import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { CreateBlog } from '../dtos/create-blog.dto';
import { BlogService } from '../services/blog.service';
@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 2 }], {
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
  async createBlog(
    @Body() body: CreateBlog,
    @UploadedFiles() upload: { images: Express.Multer.File[] },
    @Request() req,
  ) {
    body.images = upload.images.map((item) => item.path).join(',');
    return await this.blogService.createBlog(req.account.id, body);
  }
}
