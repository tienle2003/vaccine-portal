import { Status } from '../entities/vaccine-registration.entity';
import { IsEnum } from 'class-validator';

export class UpdateVaccineRegistrationDto {
  @IsEnum(Status)
  status: Status;
}
