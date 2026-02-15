import { Test, TestingModule } from '@nestjs/testing';
import { ResumesService } from './resumes.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';

describe('ResumesService', () => {
  let service: ResumesService;

  // 🔥 Mock Prisma
  const mockPrismaService = {
    resume: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  // 🔥 Mock ProfilesService
  const mockProfilesService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ProfilesService,
          useValue: mockProfilesService,
        },
      ],
    }).compile();

    service = module.get<ResumesService>(ResumesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});