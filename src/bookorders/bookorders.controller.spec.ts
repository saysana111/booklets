import { Test, TestingModule } from '@nestjs/testing';
import { BookordersController } from './bookorders.controller';

describe('BookordersController', () => {
  let controller: BookordersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookordersController],
    }).compile();

    controller = module.get<BookordersController>(BookordersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
