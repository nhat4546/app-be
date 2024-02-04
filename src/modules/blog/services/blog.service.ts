import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseFormat } from 'src/shared/common';
import { Repository } from 'typeorm';
import { CreateBlog } from '../dtos/create-blog.dto';
import { BlogEntity } from '../entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
  ) {}
  async createBlog(userId: number, input: CreateBlog): Promise<ResponseFormat> {
    try {
      const blog = new BlogEntity();
      blog.images = input.images;
      blog.description = input.description;
      blog.userId = userId;
      await this.blogRepository.save(blog);

      return {
        status: 200,
        message: 'CREATE_BLOG_SUCCESS',
        data: blog,
      };
    } catch (error) {
      console.log('CREATE_BLOG_FAIL', error);
      throw new BadRequestException(error);
    }
  }
}
