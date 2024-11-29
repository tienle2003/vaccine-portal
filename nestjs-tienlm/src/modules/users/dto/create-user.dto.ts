import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Gender } from '../entities/user.entity';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @Type(() => Date)
  @IsDate({ message: 'dob must be a valid date format (YYYY-MM-DD).' })
  @IsNotEmpty()
  dob: Date;

  @IsInt()
  @IsNotEmpty()
  provinceId: number;

  @IsInt()
  @IsNotEmpty()
  districtId: number;

  @IsInt()
  @IsNotEmpty()
  wardId: number;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{9}$|^[0-9]{12}$/, {
    message: 'idCardNumber must be 9 or 12 characters long',
  })
  idCardNumber: string;
}
