import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { ConfigService } from '@config/config.service';
import { AuthService } from './auth.service';

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(() => ({}));

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<Record<string, any>>;
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        AuthService,
        { provide: DataSource, useFactory: dataSourceMockFactory },
        { provide: ConfigService, useFactory: jest.fn() },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
