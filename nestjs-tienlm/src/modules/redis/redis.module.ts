import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'single',
        nodes: [
          {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
        ],
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisConfigModule {}
