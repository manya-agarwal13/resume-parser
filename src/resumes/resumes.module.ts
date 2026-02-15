import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { ProfilesModule } from '../profiles/profiles.module'; 

@Module({
  imports: [ProfilesModule],  
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
