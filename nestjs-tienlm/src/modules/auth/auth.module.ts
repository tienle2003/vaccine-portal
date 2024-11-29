import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blacklist } from './entities/blacklist.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UsersModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Blacklist]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('ACCESS_TOKEN_EXPIRES'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtRefreshStrategy],
})
export class AuthModule {}
