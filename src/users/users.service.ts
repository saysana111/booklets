import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { AuthService } from 'src/auth/auth.service';
import { BookOrder, BookOrderDocument } from 'src/schemas/bookorders.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel:Model<UserDocument>,
        @InjectModel(BookOrder.name) private bookOrderModel: Model<BookOrderDocument>,
        private jwtService:JwtService,
        private readonly redisService:RedisService,
){};
    //create new user
    async create(createUserDto:CreateUserDto):Promise<User>{
        const existingUser = await this.userModel.findOne({ username: createUserDto.username }).exec();
        if (existingUser) {
            return null; // Or throw an exception if preferred
        }
        const newUser = new this.userModel(createUserDto);
        const hashedPassword = await bcrypt.hash(createUserDto.password,10)
        newUser.password = hashedPassword;
        return await newUser.save();
    }
    //update user information
    async update(id:string,updateUserDto:UpdateUserDto){
        if (this.userModel.findById(id)){
            //if have user
            //check if user is loggingIn
            
            const hashedPassword = await bcrypt.hash(updateUserDto.password,10)
            updateUserDto.password = hashedPassword
            const updatedUser = await this.userModel.findByIdAndUpdate(id,updateUserDto,{new:true});
            return updatedUser
        }
        else{
            return null;
        }
    }
    //delete by update isdelete to true
    async disActivateUser(id:string){
        if (this.userModel.findById(id)){
            return await this.userModel.findByIdAndUpdate(id,{isdelete:true},{new:true})// Returns the updated document
        }else{
            return null;
        }
    }
    //changePassword
    async changePassword(loginUserDto:LoginUserDto){
        const changePwUser = await this.userModel.findOne({username:loginUserDto.username}).exec()
        if (changePwUser){
            const hashedPassword = await bcrypt.hash(loginUserDto.password,10)
            // loginUserDto.password = hashedPassword
            changePwUser.password = hashedPassword
            return await changePwUser.save()
            // await this.userModel.findOne({username:loginUserDto.username},{new:true})
            // Returns the updated document
        }else{
            return null;
        }
    }
    //terminate user
    async terminateUser(id:string){
        if (this.userModel.findById(id)){
            return await this.userModel.findByIdAndDelete(id);
        }else{
            return null
        }
    }
    //get all user
    async findAll(query:{username?:string,fname?:string,lname?:string,pageNumber?:number,pageSize?:number}) : Promise<User[]>{
        const pageSize = query.pageSize || 5;
        const pageNumber = (query.pageNumber-1)*pageSize;
        const filter : any = {};
        if(query.fname){
            filter.fname = { $regex: query.fname, $options: 'i' };
        }
        if(query.lname){
            filter.lname = { $regex: query.lname, $options: 'i' };
        }
        if(query.username){
            filter.username = { $regex: query.username, $options: 'i' };
        }
        const users = await this.userModel.find(filter).skip(pageNumber).limit(pageSize).exec();
        if(!users.length){return null}
        return users
    }
    //get login
    async login(loginUserDto:LoginUserDto){
        // for same username login attempts exceeded
        // const key = `loginAttempts:${loginUserDto.username}`; 
        // for all username
        const key = `loginAttempts:${loginUserDto.username}`
        const attemps = await this.redisService.getCount(key)
        if(attemps >= 3){
            throw new ConflictException('Login attemps exceeded')
        }
        const users = await this.userModel.findOne({username:loginUserDto.username}).exec();
        if (!users){
            await this.redisService.increment(key)
            return null
        }
        const isMatch = await bcrypt.compare(loginUserDto.password,users.password);
        if(!isMatch){
            await this.redisService.increment(key)
            return null
        }
        //assign new token and reset rediscount
        await this.redisService.resetCount(key)
        //generate new key by username sotre in Redis
        await this.redisService.generateKeyActiveuser(users.username)
        //token for login
        const token = await this.jwtService.signAsync({id:users._id,username:users.username,role:users.role})
        //save the Session
        await this.redisService.saveUserSession(users.username,token)
        return {token,users}
        // return users
    }
    //get active user 
    async reportActiveUser(){
        // Returns the number of elements in the set
        return this.redisService.getActiveUserCount()
    }
    //reportCountNewUser
    async reportCountNewUser() : Promise<number>{
        const startOfToday = new Date()
        startOfToday.setHours(0,0,0,0)
        const endOfToday = new Date()
        endOfToday.setHours(23,59,59,999)
        const count = await this.userModel.countDocuments({
            createdAt:{
                $gte:startOfToday,
                $lte:endOfToday}
            }).exec();
        return count
    }
    //suspend user
    async suspendUser(loginUserDto:LoginUserDto){
        const user = await this.userModel.findOne({username:loginUserDto.username}).exec();
        if(!user){
            return null
        }
        user.suspend = true
        return await user.save()
    }
    //desuspend user
    async deSuspendUser(loginUserDto:LoginUserDto){
        //check if the user is admin
        const user = await this.userModel.findOne({username:loginUserDto.username}).exec();
        if(!user)
            return null
        user.suspend = false
        return await user.save()
    }
    //get last book
    getLastBook(id){
        const objectId = new Types.ObjectId(id);
        // return this.bookOrderModel.findOne({userId:objectId});
        return this.bookOrderModel.find({userId:objectId}).sort({orderDate:-1}).limit(1).lean().exec()
    }
    
}
