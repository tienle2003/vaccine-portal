import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjksImVtYWlsIjoibGVtaW5odGllbjQzMjNAZ21haWwuY29tIiwiaWF0IjoxNzMyNzY3NTc5LCJleHAiOjE3MzI3Njc1Nzl9.15yx-b0FC1RlA-i3H-00krJbQ0iupPhSbc4LBg2M1CI',
    required: true,
  })
  access_token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxlbWluaHRpZW40MzIzQGdtYWlsLmNvbSIsImlkIjoyOSwiaWF0IjoxNzMyNzY3NTc5LCJleHAiOjE3MzMzNzIzNzl9.XBCXeNT7iKvL9YUTcqGs4BcCSnwxp1mHEEGIThnO5Fk',
    required: true,
  })
  refresh_token: string;
}
