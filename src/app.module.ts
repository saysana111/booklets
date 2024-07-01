import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import {   ThrottlerModule} from '@nestjs/throttler';
import { RedisModule } from './redis/redis.module';
import { BooksModule } from './books/books.module';
import { BookordersModule } from './bookorders/bookorders.module';

@Module({
  imports: [UsersModule, 
    MongooseModule.forRoot("mongodb://localhost:27017/failgate"),
    CacheModule.register({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        limit: 3,
        ttl: 5000,
      }
    ]),
    RedisModule,
    BooksModule,
    BookordersModule,
  ],
  controllers: [AppController],
  providers: [AppService,
  ],
})
export class AppModule {}
