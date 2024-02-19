import { BaseEntity } from 'src/base/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity({
  name: 'checking_information',
})
export class CheckingInformationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true })
  @OneToOne(() => AccountEntity, (account) => account.id)
  @JoinColumn()
  account: AccountEntity;

  @Column({ name: 'check_in' })
  checkIn: Date;

  @Column({ name: 'check_out', nullable: true })
  checkOut: Date;

  @Column({ name: 'work_start' })
  workStart: Date;

  @Column({ name: 'work_end' })
  workEnd: Date;
}
