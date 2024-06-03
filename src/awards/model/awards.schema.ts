import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type AwardsDocument = Awards & Document;

@Schema()
export class Awards {
  @Prop({ unique: true, default: uuidv4 })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  idUser: mongoose.Types.ObjectId;

  @Prop()
  description: string;

  @Prop()
  cover: string;
}

export const AwardsSchema = SchemaFactory.createForClass(Awards);
