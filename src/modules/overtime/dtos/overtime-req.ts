import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, MaxLength, Min } from 'class-validator';

export class CreateOvertime {
  @ApiProperty()
  @IsNotEmpty()
  projectId: number;

  @ApiProperty()
  @IsNotEmpty()
  @Min(0)
  @Max(16)
  hoursDuration: number;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(200)
  reason: string;
}
