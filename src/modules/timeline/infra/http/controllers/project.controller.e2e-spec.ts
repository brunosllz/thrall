import { UseCasesModule } from '@modules/timeline/application/use-cases/use-cases.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { PrismaDatabaseModule } from '../../prisma/prisma-database.module';
import { HttpModule } from '../http.module';
import { ProjectController } from './project.controller';

describe('ProjectController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PrismaDatabaseModule, HttpModule, UseCasesModule],
      providers: [ProjectController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/projects (POST) - create a project', () => {
    return request(app.getHttpServer()).post('/projects').expect(201);
  });
});
