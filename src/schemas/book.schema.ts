import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type BookDocument = Book & Document;

@Schema()
export class Book {
    @Prop({required:true})
    title: string;
    @Prop({required:true})
    category: string;
    @Prop({required:true})
    description: string;
    @Prop({required:true})
    price: number
    @Prop({required:true})
    amount:number
    @Prop({required:true})
    image: string
}
export const BookSchema = SchemaFactory.createForClass(Book)