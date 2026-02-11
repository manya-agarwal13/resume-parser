import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ResumesService } from './resumes.service';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),   
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.resumesService.upload(file);
  }
}
