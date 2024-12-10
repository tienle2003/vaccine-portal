import { InjectRedis } from '@nestjs-modules/ioredis';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async rateLimiter(
    userId: number,
    limit: number,
    duration: number,
  ): Promise<void> {
    const key = `forgotPassword:${userId}`;
    const current = await this.redis.incr(key);
    if (current === 1) await this.redis.expire(key, duration);
    if (current > limit)
      throw new HttpException(
        `You have exceeded the limit of ${limit} requests within ${duration} seconds.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
  }
}
