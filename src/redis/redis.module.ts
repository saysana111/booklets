import { Module } from '@nestjs/common';
import { RedisController } from './redis.controller';
import { RedisService } from './redis.service';
import { Redis } from 'ioredis';

@Module({
  controllers: [RedisController],
  providers: [RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const redis = new Redis({
          host:'localhost',
          port: 6379,
        })
      }
    }
  ],
  exports:['REDIS_CLIENT',RedisService]
})
export class RedisModule {}
