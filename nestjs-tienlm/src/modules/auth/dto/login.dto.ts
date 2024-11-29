import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'leminhtien4323@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Lmt.4323',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
