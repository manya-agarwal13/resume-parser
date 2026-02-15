import { Test, TestingModule } from '@nestjs/testing';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';

describe('ResumesController', () => {
  let controller: ResumesController;

  // 🔥 Create mock service
  const mockResumesService = {
    upload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumesController],
      providers: [
        {
          provide: ResumesService,
          useValue: mockResumesService, // ✅ Inject mock
        },
      ],
    }).compile();

    controller = module.get<ResumesController>(ResumesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
