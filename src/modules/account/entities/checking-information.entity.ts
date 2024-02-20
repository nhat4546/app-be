import { BaseEntity } from 'src/base/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity({
  name: 'checking_information',
})
export class CheckingInformationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'account_id', nullable: true })
  @JoinColumn({ name: 'account_id' })
  @ManyToOne(() => AccountEntity, (account) => account.id)
  accountId: number;

  @Column({ name: 'check_in', type: 'timestamp' })
  checkIn: Date;

  @Column({ name: 'check_out', nullable: true, type: 'timestamp' })
  checkOut: Date;

  @Column({ name: 'work_start', type: 'timestamp' })
  workStart: Date;

  @Column({ name: 'work_end', type: 'timestamp' })
  workEnd: Date;
}
