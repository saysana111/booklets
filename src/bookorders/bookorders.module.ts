import { Module } from '@nestjs/common';
import { BookordersController } from './bookorders.controller';
import { BookordersService } from './bookorders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookOrder, BookOrderSchema } from 'src/schemas/bookorders.schema';
import { Book, BookSchema } from 'src/schemas/book.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: BookOrder.name,schema:BookOrderSchema},{name:Book.name,schema:BookSchema},{name: User.name,schema:UserSchema}])],
  controllers: [BookordersController],
  providers: [BookordersService]
})
export class BookordersModule {}
