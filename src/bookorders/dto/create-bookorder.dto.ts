import {  Types } from "mongoose";
import { Book } from "src/schemas/book.schema";

export class CreateBookOrderDto{
    userId: Types.ObjectId;
    books:[{bookId:Types.ObjectId,amount:number,total:number}];
    orderDate: Date;
}
// package for dto validation 
// class validator