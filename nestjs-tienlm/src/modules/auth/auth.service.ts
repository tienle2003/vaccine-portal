import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from 'src/modules/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blacklist } from './entities/blacklist.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { queueName } from 'src/common/utils/queueName';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
    @InjectRepository(Blacklist)
    private blacklistRepository: Repository<Blacklist>,
    @InjectQueue(queueName.MAIL) private readonly mailQueue: Queue,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async generateTokenPair(
    user: User,
    refreshToken?: string,
    refreshTokenExpiresAt?: Date,
  ): Promise<LoginResponseDto> {
    const { id, email } = user;
    return {
      access_token: this.jwtService.sign({ id, email }),
      refresh_token: await this.generateRefreshToken(
        id,
        email,
        refreshToken,
        refreshTokenExpiresAt,
      ),
    };
  }

  async generateRefreshToken(
    id: number,
    email: string,
    refreshToken?: string,
    refreshTokenExpiresAt?: Date,
  ) {
    const newRefreshToken = this.jwtService.sign(
      {
        email,
        id,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    if (refreshToken && refreshTokenExpiresAt) {
      if (await this.isTokenBlacklisted(refreshToken, id))
        throw new UnauthorizedException('Invalid refresh token.');

      await this.blacklistRepository.insert({
        refreshToken,
        expiresAt: refreshTokenExpiresAt,
        userId: id,
      });
    }

    return newRefreshToken;
  }

  async isTokenBlacklisted(
    refreshToken: string,
    userId: number,
  ): Promise<boolean> {
    return await this.blacklistRepository.existsBy({ refreshToken, userId });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async clearExpiredRefreshTokens() {
    this.logger.log('clearing expired refresh tokens');
    await this.blacklistRepository.delete({
      expiresAt: LessThanOrEqual(new Date()),
    });
  }

  async logout(userId: number, refreshToken?: string, expiresAt?: Date) {
    if (await this.isTokenBlacklisted(refreshToken, userId))
      throw new UnauthorizedException('Invalid refresh token.');
    await this.blacklistRepository.insert({
      refreshToken,
      expiresAt,
      userId,
    });
  }

  async register(user: CreateUserDto): Promise<User> {
    return await this.usersService.create(user);
  }

  async forgotPassword(emailDto: ForgotPasswordDto): Promise<void> {
    const { email } = emailDto;
    const user: User = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException(`No user found for email: ${email}`);
    const tokenExpires = this.configService.get<number>(
      'RESET_PASSWORD_TOKEN_EXPIRES',
    );
    await this.redisService.rateLimiter(user.id, 5, 60);
    const token = randomBytes(16).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + tokenExpires * 60 * 1000); //5 minutes
    await this.usersService.save(user);
    const message = {
      user,
      token,
    };
    await this.mailQueue.add('sendForgotPasswordEmail', message);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { newPassword, token } = resetPasswordDto;
    const user: User = await this.usersService.findOneByResetToken(token);
    if (!user || user.resetTokenExpires < new Date())
      throw new NotFoundException('Token not found or expired');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await this.usersService.save(user);
  }
}
