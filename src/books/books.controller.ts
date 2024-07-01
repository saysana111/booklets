import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
    constructor(private readonly bookService:BooksService){}
    // get all books
    @Get()
    getAllBooks(){
        return this.bookService.findAllBook();
    }
    //get one
    @Get('/findone/:id')
    getOneBook(@Param('id') id:string){
        return this.bookService.findOneBook(id);
    }
    //- [ ] แสดงหนังสือ ( filter ตามหมวดหมู่ , เรียงลำดับหนังสือที่เหลือมาก - น้อย , ราคาต่ำ - สูง )
    @Get('/findbook')
    findBookAndSort(){
        return this.bookService.findBook()
    }
    //- [x] เพิ่ม / ลบ / แก้ไขข้อมูล Book
    @Post()
    createBook(@Body() createBookDto:CreateBookDto){
        return this.bookService.createBook(createBookDto);
    }
    //- [x] เพิ่ม / ลบ / แก้ไขข้อมูล Book
    @Put(':id')
    updateBook(@Param('id') id:string, @Body() updateBookDto:UpdateBookDto){
        return this.bookService.updateBook(id,updateBookDto);
    }
    //- [x] เพิ่ม / ลบ / แก้ไขข้อมูล Book
    @Delete(':id')
    deleteBook(@Param('id') id:string){
        return this.bookService.deleteBook(id)
    }
}
