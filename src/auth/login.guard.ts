import { Injectable, CanActivate, ExecutionContext, ConsoleLogger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private redisService: RedisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    const body = request.body
    const type = this.reflector.get<string>('type', context.getHandler());
    if (!token) return false;
    try {
      const decoded = this.jwtService.verify(token);
      //if not ADMIN
      // console.log(decoded);
    //   const userSes = await this.redisService.getUserSession(updateUserDto.username)
        // console.log(body.username);
    //   const tokenType = await this.redisService.getTokenType(token);
    //   return tokenType === type;
    // console.log(token);
    const u = await this.redisService.getUserSession(body.username)
    // console.log(u)
    if (token === u){
        return decoded.username === body.username
    }
    return false
    } catch (error) {

      return false;
    }
  }
}
