import { District } from '../../districts/entities/district.entity';
import { Province } from '../../provinces/entities/province.entity';
import { Ward } from '../../wards/entities/ward.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vaccination_sites')
export class VaccinationSite {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  detailAddress: string;

  @ManyToOne(() => Province)
  @JoinColumn({ name: 'provinceId' })
  province: Province;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'districtId' })
  district: District;

  @ManyToOne(() => Ward)
  @JoinColumn({ name: 'wardId' })
  ward: Ward;

  @Column({ type: 'varchar', length: 255 })
  manager: string;

  @Column({ type: 'int' })
  numberOfTables: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
