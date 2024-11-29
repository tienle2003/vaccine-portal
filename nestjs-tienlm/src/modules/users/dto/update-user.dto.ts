import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from '../entities/user.entity';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @Type(() => Date)
  @IsDate({ message: 'dob must be a valid date format (YYYY-MM-DD).' })
  @IsNotEmpty()
  @IsOptional()
  dob?: Date;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  provinceId?: number;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  districtId?: number;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  wardId?: number;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @Length(15)
  @IsOptional()
  healthInsuranceNumber?: string;
}
