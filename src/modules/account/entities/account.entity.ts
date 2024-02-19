import { BaseEntity } from 'src/base/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CheckingInformationEntity } from './checking-information.entity';

@Entity({ name: 'account' })
export class AccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column({
    name: 'is_verify',
    type: Boolean,
    default: false,
  })
  isVerify: boolean;

  @Column({ nullable: true })
  token: string;

  @Column({ name: 'expire_verify', nullable: true })
  expireVerify: Date;

  @Column('varchar', { nullable: true })
  @JoinColumn()
  @OneToOne(
    () => CheckingInformationEntity,
    (checking_information) => checking_information.id,
  )
  checkingInformation: CheckingInformationEntity;
}
