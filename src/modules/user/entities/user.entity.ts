import { BaseEntity } from 'src/base/entities/base.entity';
import { AccountEntity } from 'src/modules/account/entities/account.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  user_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, name: 'account_id' })
  @OneToOne(() => AccountEntity)
  @JoinColumn({ name: 'id' })
  accountId: number;

  @Column({ nullable: true, name: 'avatar_url' })
  avatarUrl: string;
}
