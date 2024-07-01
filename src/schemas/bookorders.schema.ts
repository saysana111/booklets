import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Book } from "./book.schema";
import { Types } from "mongoose";
import { User } from "./user.schema";

export type BookOrderDocument = BookOrder & Document
@Schema()
export class BookOrder {
    @Prop({ type:Types.ObjectId,ref:'User', required:true})
    userId:Types.ObjectId;
    @Prop({
        type: [{
            bookId: {type:Types.ObjectId,ref:'Book', required:true},
            amount:{type:Number, required:true},
            total:{type:Number, required:true},
        }],_id:false
    })
    books:[{bookId:Types.ObjectId,amount:number,total:number}];
    @Prop({required:true})
    orderDate: Date;

}

export const BookOrderSchema = SchemaFactory.createForClass(BookOrder);