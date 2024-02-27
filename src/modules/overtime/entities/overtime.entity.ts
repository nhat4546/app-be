import { BaseEntity } from 'src/base/entities/base.entity';
import { UserEntity } from 'src/modules/account/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OVER_TIME_STATUS, RATE } from '../constants';
import { Max, Min } from 'class-validator';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';

@Entity({ name: 'overtime' })
export class OverTimeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProjectEntity, (project) => project.id)
  project: ProjectEntity;

  @Column({
    type: 'enum',
    enum: OVER_TIME_STATUS,
    default: OVER_TIME_STATUS.PENDING,
  })
  status: OVER_TIME_STATUS;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @Column()
  @Min(0)
  @Max(16)
  hoursDuration: number;

  @Column({ type: 'enum', enum: RATE })
  rate: RATE;

  @Column()
  @Max(200)
  description: string;

  @Column()
  @Max(200)
  reason: string;
}
