import { Test, TestingModule } from '@nestjs/testing';
import { BookordersService } from './bookorders.service';

describe('BookordersService', () => {
  let service: BookordersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookordersService],
    }).compile();

    service = module.get<BookordersService>(BookordersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
