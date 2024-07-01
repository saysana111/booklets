import { Body, ConflictException, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { RolesGuard } from 'src/auth/roles.guard';
import { LoginGuard } from 'src/auth/login.guard';
import { AdminGuard } from 'src/auth/admin.guard';

@SkipThrottle()
@Controller('users')
export class UsersController {
    //1.crud - [x] เพิ่ม / ลบ / แก้ไขข้อมูล User
    constructor(private usersService:UsersService){};
    @Post('/create')
    async createNewUser(@Body() createUserDto:CreateUserDto){
        const user = await this.usersService.create(createUserDto);
        if (!user) {
          throw new ConflictException('Username already exists');
        }
        return user;
    }
    //1.crud - [x] เพิ่ม / ลบ / แก้ไขข้อมูล User
    @UseGuards(LoginGuard)
    @Patch('/update/:id')
    async update(@Param('id') id:string,@Body() updateUserDto:UpdateUserDto){
        if (!Types.ObjectId.isValid(id)){
            throw new ConflictException('Id is not valid');
        }
        const user =  await this.usersService.update(id,updateUserDto)
        if (!user){
            throw new ConflictException('User not found');
        }
        return user;
    }
    //1.crud - [x] เพิ่ม / ลบ / แก้ไขข้อมูล User
    @Patch('/deleteuser/:id')
    async delete(@Param('id') id:string){
        if (!Types.ObjectId.isValid(id)){
            throw new ConflictException('Id is not valid');
        }
        const user = await this.usersService.disActivateUser(id)
        if (!user){
            throw new ConflictException('User not found')
        }
        return user
    }
    //1.crud - [x] เพิ่ม / ลบ / แก้ไขข้อมูล User
    @Delete('/delete/:id')
    async deleteUsers(@Param('id') id:string){
        if (!Types.ObjectId.isValid(id)){
            throw new ConflictException('Id is not valid');
        }
        const user = await this.usersService.terminateUser(id)
        if (!user){
            throw new ConflictException('User not found')
        }
        return user
    }
    //2. pagination
    // @Throttle({ default: { limit: 3, ttl: 6000 } })
    //- [ ] แสดงรายการ User แบบ pagination ( สามารถ filter ตามชื่อผู้ใช้งาน , ชื่อ - นามสกุล ได้ )
    @UseGuards(AuthGuard)
    @Get()
    async getAllUsers(@Query() query:{username?:string,fname?:string,lname?:string,pageNumber?:number,pageSize?:number}){
        return await this.usersService.findAll(query);
    }
    // @SkipThrottle({default:false})
    //5. login Attempt too much
    //- [x] ระบบ Login (เมื่อมีการล็อคอินผิดพลาด 3 ครั้งจะถูกระงับ 10 วินาที)
    @Post('/login')
    async login(@Body() loginUserDto:LoginUserDto){
        const loginUser =  await this.usersService.login(loginUserDto);
        if (!loginUser){
            throw new ConflictException('User not found');
        }
        return loginUser
    }
    //6. - [ ] ระบบรายงานจำนวนสมาชิกใหม่
    @Get('/report/newuseramount')
    async reportCountNewUser(){
        return await this.usersService.reportCountNewUser();
    }
    //7.- [x] ระบบรายงานจำนวนสมาชิกที่เข้าใช้ระบบ
    @Get('/report/activeuser')
    async reportActiveUser(){
        return await this.usersService.reportActiveUser();
    }
    //8. - [x] ระบบเปลี่ยน Password
    @Post('changepassword')
    @UseGuards(LoginGuard)
    async changePassword(@Body() loginUserDto:LoginUserDto) {
        const user = await this.usersService.changePassword(loginUserDto);
        return user
    }
    //9. - [x] ระงับการใช้งาน User
    //they will unable to buy book but can login
    @Post('suspend')
    async suspendUser(@Body() loginUserDto:LoginUserDto) {
        const user = await this.usersService.suspendUser(loginUserDto);
        return user
    }
    //9. - [x] ปลดระงับการใช้งาน User
    @Post('desuspend')
    async deSuspendUser(@Body() loginUserDto:LoginUserDto) {
        const user = await this.usersService.deSuspendUser(loginUserDto);
        return user
    }

    //getlastbook
    @Get('/lastbook/:id')
    getLastBook(@Param('id') userId:string){
        return this.usersService.getLastBook(userId)
    }
}
