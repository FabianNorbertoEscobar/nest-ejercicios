import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoggerInterceptor } from 'src/utils/logger/logger.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/utils/handle/media.handler';

@Controller('videos')
//@UsePipes(new ValidationPipe())
@ApiTags('videos')
@ApiBearerAuth()
@UseInterceptors(LoggerInterceptor)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    console.log(createVideoDto);
    return this.videosService.create(createVideoDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  handleUpload(@UploadedFile() file: Express.Multer.File) {
    console.log('uploaded');
    return 'the video was uploaded';
  }

  @Get()
  findAll(@Query() query: string) {
    console.log(query);
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(+id);
  }
}
