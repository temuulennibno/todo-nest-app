import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';

@Schema({ timestamps: true })
export class Todo {
  @Prop({ default: () => nanoid(), type: String })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: false })
  checked: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
