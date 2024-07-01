import { Injectable, CanActivate, ExecutionContext, ConsoleLogger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private redisService: RedisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    const type = this.reflector.get<string>('type', context.getHandler());
    if (!token) return false;
    try {
        const decoded = this.jwtService.verify(token);
        const tokenType = await this.redisService.getTokenType(token);
        console.log(tokenType);
        console.log(type);
        if (tokenType === type){
            return decoded.role === 'ADMIN'
        }
        return false
        } catch (error) { 
        return false;
    }
  }
}
