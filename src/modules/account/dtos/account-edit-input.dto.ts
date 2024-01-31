import { ApiProperty } from '@nestjs/swagger';

export class AccountEditInput {
  @ApiProperty()
  userName: string;
}
