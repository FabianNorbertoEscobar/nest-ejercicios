import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({ unique: true, default: uuidv4 })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  price: number;

  @Prop({ required: true })
  idAuthor: string;

  @Prop()
  description: string;

  @Prop()
  cover: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.statics.findAllCourses = function () {
  const list = this.aggregate([
    {
      $lookup: {
        from: 'users',
        foreignField: 'id',
        localField: 'idAuthor',
        as: 'author',
        pipeline: [
          {
            $project: {
              _id: 0,
              description: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: '$author',
    },
  ]);

  return list;
};
