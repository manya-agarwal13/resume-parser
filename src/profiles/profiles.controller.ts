import {
  Controller,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':resumeId')
  @ApiOperation({ summary: 'Get extracted profile by Resume ID' })
  @ApiParam({
    name: 'resumeId',
    description: 'UUID of the uploaded resume',
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile fetched successfully',
    schema: {
      example: {
        id: 'profile-uuid',
        resumeId: 'resume-uuid',
        email: 'john.doe@gmail.com',
        phone: '9876543210',
        skills: ['Java', 'AWS', 'Docker'],
        education: ['B.Tech'],
        certifications: ['AWS Certified Solutions Architect'],
        experience: [
          {
            role: 'Unknown',
            years: 2,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found',
  })
  async getProfile(@Param('resumeId') resumeId: string) {
    const profile = await this.profilesService.findByResumeId(resumeId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }
}
