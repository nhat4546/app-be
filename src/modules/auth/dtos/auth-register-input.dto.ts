import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MaxLength } from 'class-validator';
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
}
