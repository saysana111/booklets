import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService
  ) {}

  async login(userId: string) {
    const payload = { userId, type: 'login' };
    const token = this.jwtService.sign(payload);
    await this.redisService.storeToken(token, 'login');
    return token;
  }

  async generatePasswordChangeToken(userId: string) {
    const payload = { userId, type: 'passwordChange' };
    const token = this.jwtService.sign(payload);
    await this.redisService.storeToken(token, 'passwordChange');
    return token;
  }
}
