import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';
import env from './env';

@Module({
  imports: [MongooseModule.forRoot(env.MONGO_URL), TodosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
