import { User } from 'src/modules/users/entities/user.entity';
import { VaccinationResult } from 'src/modules/vaccination_results/entities/vaccination_result.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PriorityType {
  ONE = 1,
  TWO = 2,
  THREE = 3,
}

export enum InjectionSession {
  MORNING = 1,
  AFTERNOON = 2,
}

export enum Status {
  PENDING = 1,
  REJECTED = 2,
  COMPLETED = 3,
}

@Entity()
export class VaccineRegistration {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: PriorityType, default: PriorityType.ONE })
  priorityType: PriorityType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  job?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  currentAddress?: string;

  @Column({ type: 'timestamp', nullable: true })
  preferredDate?: Date;

  @OneToOne(
    () => VaccinationResult,
    (vaccinationResult) => vaccinationResult.vaccineRegistration,
    { cascade: true },
  )
  vaccinationResult: VaccinationResult;

  @Column({
    type: 'enum',
    enum: InjectionSession,
    default: InjectionSession.MORNING,
  })
  injectionSession: InjectionSession;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
