import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class ListProjectParams {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  projectName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;
}
