import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ResumesModule } from './resumes/resumes.module';

@Module({
  imports: [PrismaModule, ResumesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
