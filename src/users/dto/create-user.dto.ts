export class CreateUserDto{
    username:string;
    password:string;
    fname:string;
    lname:string
    isdelete:boolean;//to know that user isDelete 
    role:string;
    loginCount:string;
    suspend:boolean; // if true cant buy
}