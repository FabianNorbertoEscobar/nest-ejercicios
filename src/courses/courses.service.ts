import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './model/courses.schema';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/users/model/user.schema';

interface ModelExt<T> extends Model<T> {
  delete: (data: { _id: Types.ObjectId }) => void;
  // findAllCourses: () => void;
  paginate: (query: any, pagination: any) => void;
}

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: ModelExt<CourseDocument>,
    @InjectModel(User.name) private readonly userModel: ModelExt<UserDocument>,
  ) {}

  create(createCourseDto: CreateCourseDto) {
    return this.courseModel.create(createCourseDto);
  }

  async findAll(pagination: any) {
    /*     const options = {
      page: 2,
      limit: 5
    }
 */
    return this.courseModel.paginate({}, pagination);
    // return this.courseModel.findAllCourses();

    //    const courses = this.courseModel.find({});
    //    return courses;
  }

  async findOne(id: string) {
    return this.courseModel.findOne({ id });
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    return this.courseModel.findOneAndUpdate({ id }, updateCourseDto, {
      upsert: true,
      new: true,
    });
  }

  remove(id: string) {
    const _id = new Types.ObjectId(id);
    const response = this.courseModel.delete({ _id });
    return response;
  }
}
