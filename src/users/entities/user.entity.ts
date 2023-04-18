import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';

@Schema()
export class User {
  @Prop({ default: () => nanoid() })
  _id: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  password: string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
