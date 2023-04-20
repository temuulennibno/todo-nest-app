import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';
import { getRandomNumber } from 'src/utils/generateRandom';

@Schema({ timestamps: true })
export class Otp {
  @Prop({ default: () => nanoid() })
  _id: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ required: true, default: () => getRandomNumber(100000, 1000000 - 1) })
  token: number;

  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
