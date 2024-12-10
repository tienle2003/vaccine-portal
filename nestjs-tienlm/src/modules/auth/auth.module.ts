import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blacklist } from './entities/blacklist.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisConfigModule } from '../redis/redis.module';
import { BullConfigModule } from '../bullMQ/bullMQ.module';
import { JwtConfigModule } from './jwt.module';

@Module({
  imports: [
    UsersModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Blacklist]),
    JwtConfigModule,
    BullConfigModule,
    RedisConfigModule,
    PassportModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtRefreshStrategy],
})
export class AuthModule {}
