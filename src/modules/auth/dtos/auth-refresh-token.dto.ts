import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenInput {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
