import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVaccineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  batchNumber: string;
}
