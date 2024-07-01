import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
    constructor(private redisService:RedisService) {
        
    }

    @Get()
    async get() {
        
        // return this.redisService.setKey('count',  null);
        // let c = await this.redisService.getKey('count')
        // if (c){
        //     await this.redisService.setKey('count', '1');
        // }
        // c = String(Number(c)+1)
        // await this.redisService.setKey('count', c)
        // return { key: 'count', value: c };
    }
}
