import { Test, TestingModule } from '@nestjs/testing';
import { CopounsService } from './copouns.service';

describe('CopounsService', () => {
  let service: CopounsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CopounsService],
    }).compile();

    service = module.get<CopounsService>(CopounsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
