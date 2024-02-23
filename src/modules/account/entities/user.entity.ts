import { BaseEntity } from 'src/base/entities/base.entity';
import { AccountEntity } from 'src/modules/account/entities/account.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ROLE } from '../constants';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'user_name', nullable: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.STAFF })
  role: ROLE;

  @Column({ unique: true, name: 'account_id' })
  @OneToOne(() => AccountEntity)
  @JoinColumn({ name: 'id' })
  accountId: number;

  @Column('numeric', { nullable: true, name: 'project' })
  @OneToMany(() => ProjectEntity, (project) => project.id)
  project: ProjectEntity;

  @Column({ nullable: true, name: 'avatar_url' })
  avatarUrl: string;
}
