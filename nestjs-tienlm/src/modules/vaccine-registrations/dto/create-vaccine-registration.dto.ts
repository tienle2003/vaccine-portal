import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import {
  InjectionSession,
  PriorityType,
} from '../entities/vaccine-registration.entity';

export class CreateVaccineRegistrationDto {
  @IsEnum(PriorityType)
  @IsNotEmpty()
  priorityType: PriorityType;

  @Length(0, 255)
  @IsString()
  @IsOptional()
  job?: string;

  @Length(0, 255)
  @IsString()
  @IsOptional()
  company?: string;

  @Length(0, 500)
  @IsString()
  @IsOptional()
  currentAddress?: string;

  @IsOptional()
  @IsDateString()
  preferredDate?: Date;

  @IsOptional()
  @IsEnum(InjectionSession)
  injectionSession: InjectionSession;
}
