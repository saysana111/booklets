import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema({timestamps:true})
export class User{
    @Prop({required: true,unique:true})
    username: string;
    @Prop({required: true})
    password:string;
    @Prop({ required: true })
    fname: string;
    @Prop({required:true})
    lname: string;
    // delete status
    @Prop({default:false})
    isdelete:boolean; 
    @Prop({ required: true })
    role: string;
    @Prop({ default:false})
    suspend: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User)