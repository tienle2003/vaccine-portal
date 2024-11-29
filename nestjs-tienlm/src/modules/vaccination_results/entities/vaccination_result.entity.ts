import { VaccinationSite } from 'src/modules/vaccination-sites/entities/vaccination-site.entity';
import { VaccineRegistration } from 'src/modules/vaccine-registrations/entities/vaccine-registration.entity';
import { Vaccine } from 'src/modules/vaccines/entities/vaccine.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class VaccinationResult {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'boolean', default: false })
  isInjected: boolean;

  @Column({ type: 'timestamp', nullable: true })
  injectionDate: Date;

  @ManyToOne(() => VaccinationSite)
  vaccinationSite: VaccinationSite;

  @ManyToOne(() => Vaccine)
  vaccine: Vaccine;

  @OneToOne(
    () => VaccineRegistration,
    (vaccineRegistration) => vaccineRegistration.vaccinationResult,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  vaccineRegistration: VaccineRegistration;
  vaccinationResult: { id: number };
}
