import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata, Query } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Secured } from 'src/auth/secured.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll(@Query() size: number) {
    return this.todosService.findAll();
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.todosService.findOne(_id);
  }

  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(_id, updateTodoDto);
  }

  @Secured('admin')
  @Delete(':_id')
  remove(@CurrentUser() user: User, @Param('_id') _id: string) {
    console.log('user is:', user);
    return this.todosService.remove(_id);
  }
}
