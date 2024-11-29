import { IsBoolean, IsDateString, IsInt, IsOptional } from 'class-validator';

export class UpdateVaccinationResultDto {
  @IsBoolean()
  isInjected: boolean;

  @IsDateString()
  injectionDate: Date;

  @IsInt()
  vaccinationSiteId: number;

  @IsInt()
  vaccineId: number;
}
