import { Test, TestingModule } from '@nestjs/testing';
import { CopounsController } from '../copouns.controller';
import { CopounsService } from '../copouns.service';

describe('CopounsController', () => {
  let controller: CopounsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CopounsController],
      providers: [CopounsService],
    }).compile();

    controller = module.get<CopounsController>(CopounsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
