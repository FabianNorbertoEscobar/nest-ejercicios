import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './model/courses.schema';
import { User, UserSchema } from 'src/users/model/user.schema';
import { PaginationMiddleware } from '../pagination/pagination.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      /*         {
                  name: Course.name,
                  schema: CourseSchema
                }, */
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Course.name,
        useFactory: () => {
          const schema = CourseSchema;
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationMiddleware)
      .forRoutes({ path: 'v1/courses', method: RequestMethod.GET });
  }
}
