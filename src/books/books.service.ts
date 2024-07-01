import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from 'src/schemas/book.schema';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
    @InjectModel(Book.name) private bookModel: Model<BookDocument>;

    //get all
    findAllBook(){
        return this.bookModel.find();
    }
    //get book with optional filter
    findBook(){
        return this.bookModel.aggregate([
            {
                $group:{
                    _id:{
                        category:'$category',
                        bookId: '$_id'
                    },
                    category: { $first: '$category' },
                    bookId: { $first: '$_id' },
                    title: { $first: '$title' },
                    description:{$first:'$description'} ,
                    amount: { $first: '$amount' },
                    price: { $first: '$price' }
                }
            },
            {
                $sort:{'amount':-1,'price':1}// amount desc and price asc
            },{
                $group:{
                    _id:'$category',
                    books:{
                        $push:{
                            _id:'$bookId',
                            title:'$title',
                            description: '$description',
                            price: '$price',
                            amount: '$amount',
                        }
                    }
                }
            },{
                $sort:{_id:1}
            }
        ]).exec();
    }
    //create one
    createBook(createBookDto: CreateBookDto){
        return this.bookModel.create(createBookDto);
    }
    //get one
    findOneBook(id: string){
        return this.bookModel.findById(id);
    }
    //update one
    updateBook(id: string, updateBookDto: UpdateBookDto){
        return this.bookModel.findByIdAndUpdate(id, updateBookDto, {new: true});
    }
    //delete one
    deleteBook(id:string){
        return this.bookModel.findByIdAndDelete(id).exec();
    }

}
