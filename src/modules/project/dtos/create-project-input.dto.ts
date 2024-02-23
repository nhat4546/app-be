import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProjectInput {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  projectName: string;

  @IsNotEmpty()
  divisionManagerId: number;

  @IsNotEmpty()
  projectManagerId: number;
}
