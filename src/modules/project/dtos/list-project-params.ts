import { ApiProperty } from '@nestjs/swagger';
export class ListProjectParams {
  @ApiProperty()
  projectName?: string;

  @ApiProperty()
  page?: number;

  @ApiProperty()
  limit?: number;
}
