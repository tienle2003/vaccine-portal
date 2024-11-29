import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vaccine {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  batchNumber: string;
}
