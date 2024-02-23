import { Expose } from 'class-transformer';

export class DivisionProjectMangerOutput {
  @Expose()
  id: number;

  @Expose()
  user_name: string;

  @Expose()
  email: string;
}
