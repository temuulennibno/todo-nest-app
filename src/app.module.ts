import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URL), TodosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
