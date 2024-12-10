import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get('REDIS_HOST');
        const redisPost = configService.get('REDIS_POR');
        return {
          type: 'single',
          url: `redis://${redisHost}:${redisPost}`,
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisConfigModule {}
