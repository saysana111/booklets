import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { BookOrder, BookOrderDocument } from 'src/schemas/bookorders.schema';
import { CreateBookOrderDto } from './dto/create-bookorder.dto';
import { Book, BookDocument } from 'src/schemas/book.schema';
import { User,UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class BookordersService {
    @InjectModel(BookOrder.name) private bookOrderModel: Model<BookOrderDocument>;
    @InjectModel(Book.name) private bookModel: Model<BookDocument>;
    @InjectModel(User.name) private userModel:Model<UserDocument>;
    
    // get all orders
    findAllBookOrder(){
        // return this.bookOrderModel.findById("667d3b96b984653140150197").populate('books.bookId').exec();
        return this.bookOrderModel.aggregate([
            {
                $lookup: {
                    from: 'bookorders',
                    localField: '_id',
                    foreignField: 'bookId',
                    as: 'bookorders'
                }
            }
        ]).exec()
    }
    //ระบบรายงานหนังสือที่ถูกขายในแต่ละหมวดหมู่
    getReportOrder(){
        return this.bookOrderModel.aggregate([
            {
                $unwind: '$books'
            },
            {
                $lookup:{
                    from: 'books',
                    localField: 'books.bookId',
                    foreignField: '_id',
                    as: 'bookdetail'
                }
            },
            {
                $unwind:'$bookdetail'
            },
            {
                $addFields:{
                    total: {$multiply:['$books.amount','$bookdetail.price']}
                }
            },
            {
                $group:{
                    _id: '$bookdetail.category',
                    quantity: {$sum: '$books.amount'},
                    total:{$sum: '$total'},
                    books:{
                        $push:
                        {
                            bookId: '$books.bookId',
                            title: '$bookdetail.title',
                            amount: '$books.amount',
                            description:'$bookdetail.description',
                            price: '$bookdetail.price',
                            total: '$total',
                        }
                    }
                }
            },
            {
                $sort: {_id : 1}
            }
        ]).exec()
    }
    //getReportBestSale[ ] จัดอันดับหนังสือที่ถูกขายเยอะที่สุด|หนังสือที่ใกล้จะหมด
    getReportBestSale(sortBy:string){
        if (!sortBy){
            sortBy = 'quantity'
        }
        const sortField = sortBy === 'quantity' ? 'quantity' : 'amount';
        const sortDirection = sortBy === 'amount' ? 1 : -1;
        return this.bookOrderModel.aggregate([
            {
                $unwind: '$books'
            },
            {
                $lookup:{
                    from: 'books',
                    localField: 'books.bookId',
                    foreignField: '_id',
                    as: 'bookdetail'
                }
            },
            {
                $unwind:'$bookdetail'
            },
            {
                $group:{
                    _id: '$bookdetail._id',
                    title: {$first: '$bookdetail.title'},
                    description: {$first: '$bookdetail.description'},
                    price: {$first: '$bookdetail.price'},
                    quantity: {$sum: '$books.amount'},
                    amount: {$first:'$bookdetail.amount'}
                }
            },
            {
                $sort: {[sortField]: sortDirection}
            }
        ]).exec();
    }
    // getReportRankUser
    getReportRankUser(){
        return this.bookOrderModel.aggregate([
            {
                $lookup: {
                  from: 'users', // The collection to join
                  localField: 'userId', // The field from the BookOrder documents
                  foreignField: '_id', // The field from the User documents
                  as: 'userDetails' // The new field with the matched documents
                }
            }
        ]).exec();
    }
    // create one
    async createBookOrder(createBookOrder: CreateBookOrderDto){
        const books = createBookOrder.books
        console.log(books);
        //check if suspended user
        const flagSuspend = await this.userModel.findById(createBookOrder.userId)
        console.log(flagSuspend.suspend);
        if (flagSuspend.suspend === true) {
            throw new HttpException('User is suspended',403);
        }
        //if true
        const createorder = createBookOrder
        createorder.userId = new Types.ObjectId(createorder.userId)
        return await this.bookOrderModel.create(createorder);
    }
    //get amount of book all users have bought
    getAmountOfBook(){
        return this.bookOrderModel.aggregate([
                { $unwind: "$books" }, // Deconstruct the books array
                { $group: {
                    _id: "$userId", // Group by the user field
                    totalBooks: { $sum: "$books.amount" } // Sum the amounts of books
                    }
                },
                { $lookup: {
                    from: "users", // The collection to join
                    localField: "userId", // Field from the input documents
                    foreignField: "users._id", // Field from the documents of the "from" collection
                    as: "userInfo" // Output array field
                    }
                },
                { $unwind: "$userInfo" }, // Optional: Unwind the userInfo if you expect one user per document
                { $group: {
                    _id: "$_id",
                    totalBooks: { $first: "$totalBooks" }, // Use $first since totalBooks are the same for each group
                    userInfo: { $first: "$userInfo" },
                }},
                { $project: {
                    _id: 0,
                    userId: "$_id",
                    totalBooks: 1,
                    fname: "$users.fname",
                    lname: "$lname"
                }}
        ])
        return this.bookOrderModel.aggregate([
            {
                $unwind:'$books' //Deconstruct the book array
            },{
            $group: {
                _id: null,
                amount: { $sum: '$books.amount' }
            }
        }]);
    }
    //get last bought date of users
    getLastBoughtDateOfAllUser(){
        return this.bookOrderModel.aggregate([
            {
                $group:{
                    _id: '$userId', // Group by userid
                    lastBoughtDate: { $max: '$orderDate' }
                }
            },
            {
                $project:{
                    _id: 0,
                    userId: '$_id',
                    lastBoughtDate: 1//desc
                }
            }
        ]).exec();
    }
    async getMostBoughtbycate(){
        const result = await this.bookOrderModel.aggregate([
            { $unwind: "$books" },
            { $lookup: {
                from: "books", // the collection to join
                localField: "books.bookId", // field in the BookOrders collection
                foreignField: "_id", // field in the Books collection
                as: "bookDetails"
            }},
            { $unwind: "$bookDetails" },
            { $group: {
                _id: "$bookDetails.category",
                totalSales: { $sum: "$books.total" },
                totalQuantity: { $sum: "$books.amount" },
                books: { $push: { 
                  bookTitle: "$bookDetails.title", 
                  sales: "$books.total",
                  quantity: "$books.amount",
                  bookId: "$bookDetails._id"
                }}
            }},
            { $project: {
                category: "$_id",
                totalSales: 1,
                totalQuantity: 1,
                books: { $arrayElemAt: [
                  { $slice: [
                    { $sortArray: {
                      input: "$books",
                      sortBy: { sales: -1 } // Sort by sales descending
                    }}, 1 // Get top selling book only
                  ]}, 0
                ]}
            }}
          ]);
        return result
    }
    async getMostBought(){
        return await this.bookOrderModel.aggregate([
                { $unwind: "$books" }, // Deconstruct the books array
                { $group: { 
                    _id: "$userId", 
                    totalBooksBought: { $sum: "$books.amount" } 
                  }}, // Group by user and sum the book amounts
                { $sort: { totalBooksBought: -1 } }, // Sort users by total books bought in descending order
                // { $limit: 1 }, // Limit to the top user
                // { $lookup: { 
                //     from: "users", // Assuming your user collection is named 'users'
                //     localField: "userId", 
                //     foreignField: "_id", 
                //     as: "userInfo"
                //   }}, // Join with the User collection to fetch user details
                // { $unwind: "$userInfo" }, // Unwind the userInfo array to simplify it
                // { $project: { 
                //     _id: 0, 
                //     userId: "$_id", 
                //     totalBooksBought: 1, 
                //     name: "$last.lname", 
                // }} 
        ])
    }
}
