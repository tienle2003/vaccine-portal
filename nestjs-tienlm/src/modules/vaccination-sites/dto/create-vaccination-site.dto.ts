import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateVaccinationSiteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  detailAddress?: string;

  @IsInt()
  @IsNotEmpty()
  provinceId: number;

  @IsInt()
  @IsNotEmpty()
  districtId: number;

  @IsInt()
  @IsNotEmpty()
  wardId: number;

  @IsString()
  @IsNotEmpty()
  manager: string;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  numberOfTables: number;
}
