import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SlugPipe } from './pipes/slug.pipe';
import { BrowserAgentGuard } from 'src/guards/browser-agent/browser-agent.guard';
import { JwtGuardGuard } from '../guards/jwt-guard/jwt-guard.guard';
import { Request } from 'express';
import { RolesGuardGuard } from '../guards/roles-guard/roles-guard.guard';
import { Rol } from 'src/decorators/rol/rol.decorator';
import { Paginate } from '../paginate/paginate.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('courses')
@ApiTags('courses')
@ApiBearerAuth()
@UseGuards(BrowserAgentGuard)
@UseGuards(JwtGuardGuard, RolesGuardGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Rol(['admin', 'manager', 'user'])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  //  @SetMetadata('rol', ['admin','manager'])
  @Rol(['admin', 'manager', 'user'])
  @Get()
  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  findAll(@Req() req: Request, @Paginate() pagination: any) {
    console.log(req.user);
    return this.coursesService.findAll(pagination);
  }

  @Rol(['admin', 'manager', 'user'])
  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: string,
  ) {
    return this.coursesService.findOne(id);
  }

  @Rol(['admin', 'manager', 'user'])
  @Get('title/:title')
  getDetail(@Param('title', new SlugPipe()) title: string) {
    console.log(title);
    return this.coursesService.findOne(title);
  }

  @Rol(['admin', 'manager', 'user'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Rol(['admin', 'manager', 'user'])
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
