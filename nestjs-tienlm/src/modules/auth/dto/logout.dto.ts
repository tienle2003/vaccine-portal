import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class LogoutDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @Type(() => Date)
  @IsNotEmpty()
  expiresAt?: Date;
}
