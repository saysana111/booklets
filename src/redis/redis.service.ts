import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit,OnModuleDestroy {
    private client:Redis;
    constructor(){
        this.client = new Redis({
            host:'localhost',
            port:6379
        })
    }
    onModuleInit() {
        this.client.on('connect', () => {
          console.log('Connected to Redis');
        });
    
        this.client.on('error', (err) => {
          console.error('Redis error', err);
        });
      }
    
      onModuleDestroy() {
        this.client.quit();
      }
      async storeToken(token: string, type: string): Promise<void> {
        await this.client.set(token, type, 'EX', 3600); // Expire in 1 hour
      }
    
      async getTokenType(token: string): Promise<string | null> {
        return this.client.get(token);
      }
    // Example method to set a key
    async setKey(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
    }

    // Example method to get a key
    async getKey(key: string): Promise<string> {
        return await this.client.get(key);
    }
    async increment(key: string): Promise<void> {
         await this.client.incr(key);
         await this.client.expire(key,10)
    }

    async getCount(key: string): Promise<number> {
        const result = await this.client.get(key);
        return result ? parseInt(result) : 0;
    }

    async resetCount(key: string): Promise<void> {
        await this.client.del(key);
    }
    async generateKeyActiveuser(username) {
      const key = `user:active:${username}`;
      await this.client.set(key, 'true', 'EX', 30); // Expires after 300 seconds (5 minutes)
    }
    async getActiveUserCount() {
      const keys = await this.client.keys('user:active:*');
      return keys.length;
  }
  async saveUserSession(username: string, sessionToken: string): Promise<void> {
    await this.client.set(`userSession:${username}`, sessionToken, 'EX', 30); // Expires in 1 hour
  }

  async getUserSession(username: string): Promise<string | null> {
    return await this.client.get(`userSession:${username}`);
  }

  async deleteUserSession(username: string): Promise<void> {
    await this.client.del(`userSession:${username}`);
  }
  
  async  findTokenByUsername(username) {
    const tokenId = await this.client.get(`username:${username}`);
    console.log(tokenId);
    return tokenId; // This will be the identifier of the token
  }
}
