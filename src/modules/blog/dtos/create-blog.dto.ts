import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlog {
  @IsOptional()
  images: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
