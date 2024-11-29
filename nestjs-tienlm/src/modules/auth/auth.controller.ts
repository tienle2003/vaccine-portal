import {
  Req,
  Body,
  Post,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginResponseDto } from './dto/login-response.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtRefreshAuthGuard } from 'src/common/guards/jwt-refresh-auth.guard';
import { Request } from 'express';
import { DecodedTokenDto } from './dto/decoded-token.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Public()
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ResponseMessage('Login successfully!')
  @ApiCreatedResponse({
    type: LoginResponseDto,
    description: 'Login successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  @ApiBody({
    type: LoginDto,
    description: 'enter your email and password to login to your account',
  })
  async login(@Body() loginBody: LoginDto): Promise<LoginResponseDto> {
    const user: User = await this.authService.validateUser(
      loginBody.email,
      loginBody.password,
    );
    return this.authService.generateTokenPair(user);
  }

  @Post('register')
  @ResponseMessage('Register successfully!')
  async register(@Body() registerBody: CreateUserDto): Promise<any> {
    return this.authService.register(registerBody);
  }

  @Public()
  @Post('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@Req() req: Request) {
    if (!req.user) {
      throw new InternalServerErrorException();
    }
    return this.authService.generateTokenPair(
      (req.user as any).attributes,
      req.body.refreshToken,
      (req.user as any).refreshTokenExpiresAt,
    );
  }

  @Post('logout')
  @UseGuards(JwtRefreshAuthGuard)
  async logout(@Req() req: Request) {
    const { attributes, refreshTokenExpiresAt } = req.user as DecodedTokenDto;
    await this.authService.logout(
      attributes.id,
      req.body.refreshToken,
      refreshTokenExpiresAt,
    );
  }

  @Post('forgot-password')
  @ResponseMessage('reset password link was sent successfully!')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ResponseMessage('Password has been successfully reset.')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(resetPasswordDto);
  }
}
