import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookordersService } from './bookorders.service';
import { CreateBookOrderDto } from './dto/create-bookorder.dto';
import { Types } from 'mongoose';
import { isEmail, isMongoId, isNumber, isString } from 'class-validator';

@Controller('bookorders')
export class BookordersController {
    constructor(private readonly bookOrderService:BookordersService){}
    // get all book orders
    @Get()
    getAllBookOrders(){
        return this.bookOrderService.findAllBookOrder();
    }
    //- [ ] แสดงรายการ User สามารถแสดง จำนวนหนังสือ ทั้งหมดที่แต่ละ user ซื้อไปได้
    @Get('/count')
    getAmountAllUserBook(){
        return this.bookOrderService.getAmountOfBook();
    }
    // - [x] แสดงรายการ User สามารถแสดง วันที่ ซื้อหนังสือล่าสุดของแต่ละ user ได้
    @Get('/getlastbuydate')
    getLastBuyDate(){
        return this.bookOrderService.getLastBoughtDateOfAllUser();
    }
    // ระบบรายงานหนังสือที่ถูกขายในแต่ละหมวดหมู่
    @Get('reportorderbycate')
    getReportOrder(){
        return this.bookOrderService.getReportOrder();
    }
    //getReportBestSale[ ] จัดอันดับหนังสือที่ถูกขายเยอะที่สุด|หนังสือที่ใกล้จะหมด
    @Get('/reportbestsale')
    getReportBestSale(@Query('sortBy') sortBy:string ){
        return this.bookOrderService.getReportBestSale(sortBy);
    }
    // report - [ ] ระบบจัดอันดับผู้ที่ซื้อหนังสือ จำนวนกี่เล่ม แบ่งเป็นหมวดหมู่ละกี่เล่ม ราคาเท่าไหร่
    @Get('/reportbyuse')
    getReportRankUser(){
        return this.bookOrderService.getReportRankUser();
    }
    // - [ ] ระบบบันทึกการซื้อหนังสือของ user
    @Post()
    async createBookOrder(@Body() createBookOrderDto:CreateBookOrderDto){
        return await this.bookOrderService.createBookOrder(createBookOrderDto)
    }
    // - [ ] ระบบจัดอันดับผู้ที่ซื้อหนังสือ จำนวนกี่เล่ม
    @Get('/getmostbought')
    async getMostBought(){
        return await this.bookOrderService.getMostBought();
    }
    //ระบบจัดอันดับแบ่งเป็นหมวดหมู่ กี่เล่ม ราคาเท่าไหร่ 
    @Get('/getmostboughtbycate')
    async getMostBoughtbycate(){
        return await this.bookOrderService.getMostBoughtbycate();
    }

}
