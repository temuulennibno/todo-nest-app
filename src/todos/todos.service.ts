import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './entities/todo.entity';
import { Model } from 'mongoose';
import { Secured } from 'src/auth/secured.decorator';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private readonly todoModel: Model<Todo>) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    console.log('createTodoDto:', createTodoDto);
    const result = new this.todoModel(createTodoDto);
    return result.save();
  }

  async findAll(): Promise<Todo[]> {
    const result = await this.todoModel.find();
    return result;
  }

  async findOne(_id: string) {
    return await this.todoModel.findById(_id);
  }

  async update(_id: string, updateTodoDto: UpdateTodoDto) {
    const result = await this.todoModel.updateOne({ _id }, updateTodoDto);
    return result;
  }

  @Secured()
  async remove(_id: string) {
    await this.todoModel.deleteOne({ _id });
    return _id;
  }
}
