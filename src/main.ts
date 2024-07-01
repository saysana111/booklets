import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
// npm i --save ioredis   
//  nest g module redis
// npm i bcrypt     
// npm install @nestjs/jwt
// npm install @nestjs/cache-manager cache-manager
// npm install @nestjs/mapped-types     
// npm i @nestjs/mongoose mongoose    
//  nest new .  
// npm i -g @nestjs/cli       
// npm i momen
// npm i --save class-validator class-transformer
//git push -u origin main