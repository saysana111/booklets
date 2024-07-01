import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerStorageService } from '@nestjs/throttler';
import { RedisService } from 'src/redis/redis.service';
import { BookOrder, BookOrderSchema } from 'src/schemas/bookorders.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:User.name,schema:UserSchema},{name: BookOrder.name,schema:BookOrderSchema}]),
  JwtModule.register({
    global:true,
    secret:jwtConstants.secret,
    signOptions:{expiresIn:'1h'}
  }),
],
  controllers: [UsersController],
  providers: [UsersService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },RedisService,
  ]
})
export class UsersModule {}
