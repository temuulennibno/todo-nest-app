import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(_id: string) {
    return await this.userModel.findOne({ _id });
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    const result = await this.userModel.findOneAndUpdate({ _id }, updateUserDto);
    return result;
  }

  async remove(_id: string) {
    await this.userModel.deleteOne({ _id });
    return _id;
  }
}
