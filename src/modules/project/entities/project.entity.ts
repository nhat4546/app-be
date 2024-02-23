import { Max } from 'class-validator';
import { BaseEntity } from 'src/base/entities/base.entity';
import { UserEntity } from 'src/modules/account/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
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

  @Column('numeric', { name: 'division_manager' })
  @ManyToOne(() => UserEntity, (user) => user.id)
  divisionManager: number;

  @Column('numeric', { name: 'project_manager' })
  @OneToOne(() => UserEntity, (user) => user.id)
  projectManager: number;
}
