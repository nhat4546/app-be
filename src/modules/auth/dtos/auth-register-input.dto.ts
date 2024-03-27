import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Matches,
  MaxLength,
} from 'class-validator';
import { ROLE } from 'src/modules/account/constants';
import { PASSWORD_REGEX } from 'src/shared/constants/regex';

export class RegisterInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty()
  @Matches(PASSWORD_REGEX, {
    message: '$property format invalid ',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE;
}
