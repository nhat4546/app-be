import { Expose } from 'class-transformer';

export class AccountDetailOutput {
  @Expose()
  id: number;

  @Expose()
  user_name: string;

  @Expose()
  email: string;

  @Expose()
  avatarUrl: string;
}
