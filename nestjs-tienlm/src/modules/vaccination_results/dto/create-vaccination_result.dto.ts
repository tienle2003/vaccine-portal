import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateVaccinationResultDto {
  @IsInt()
  @IsNotEmpty()
  vaccineRegistrationId: number;
}
