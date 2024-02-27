import { Max } from 'class-validator';
import { BaseEntity } from 'src/base/entities/base.entity';
import { UserEntity } from 'src/modules/account/entities/user.entity';
import { OverTimeEntity } from 'src/modules/overtime/entities/overtime.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_name' })
  @Max(200)
  projectName: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  divisionManager: UserEntity;

  @OneToOne(() => UserEntity, (user) => user.id)
  projectManager: UserEntity;

  @OneToMany(() => OverTimeEntity, (ot) => ot.id)
  overtimes: OverTimeEntity[];
}
