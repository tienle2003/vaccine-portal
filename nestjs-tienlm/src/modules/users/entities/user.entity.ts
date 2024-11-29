import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from 'src/common/enum/role.enum';
import { Province } from 'src/modules/provinces/entities/province.entity';
import { District } from 'src/modules/districts/entities/district.entity';
import { Ward } from 'src/modules/wards/entities/ward.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  OTHER = 'O',
}

@Entity('users')
export class User {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  @ApiProperty({
    example: 'Le Minh Tien',
    required: true,
  })
  name: string;

  @Column({ unique: true })
  @ApiProperty({
    example: 'Le Minh Tien',
    required: true,
  })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'date' })
  @ApiProperty({
    example: '2003-03-15',
    required: true,
  })
  dob: Date;

  @ManyToOne(() => Province)
  province: Province;

  @ManyToOne(() => District)
  district: District;

  @ManyToOne(() => Ward)
  ward: Ward;

  @Column({ length: 12, unique: true })
  @ApiProperty({
    example: '001203041020',
    required: true,
  })
  idCardNumber: string;

  @Column({ length: 15, unique: true, nullable: true })
  @ApiProperty({
    example: '001203041020',
    required: true,
  })
  healthInsuranceNumber: string;

  @Column({ type: 'enum', enum: Gender })
  @ApiProperty({
    example: 'O',
    required: true,
  })
  gender: Gender;

  @Column({ length: 32, unique: true, nullable: true })
  @ApiProperty()
  resetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty()
  resetTokenExpires: Date;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  @ApiProperty({
    example: 'Admin',
    required: true,
  })
  role: Role;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
