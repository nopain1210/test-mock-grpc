import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import * as process from 'process';
import { glob } from 'glob';
import * as path from 'path';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let helloServiceContainer: StartedTestContainer;

  const startMockHelloService = async () => {
    const mockPath = path.join(__dirname, 'mock/hello');
    const mockFiles = await glob('**', {
      nodir: true,
      cwd: mockPath,
    });
    helloServiceContainer = await new GenericContainer('tkpd/gripmock')
      .withExposedPorts(4770)
      .withCopyFilesToContainer(
        mockFiles.map((file) => ({
          source: path.join(mockPath, file),
          target: path.join('/mock', file),
        })),
      )
      .withCommand(['--stub=/mock/stub', '/mock/hello.proto'])
      .start();
    process.env.HELLO_GRPC_URL = `${helloServiceContainer.getHost()}:${helloServiceContainer.getMappedPort(
      4770,
    )}`;
  };

  beforeAll(async () => {
    return startMockHelloService();
  });

  afterAll(async () => {
    return await helloServiceContainer.stop();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/hello (GET)', () => {
    it('should return "Hello World"', async () => {
      return request(app.getHttpServer())
        .get('/hello')
        .query({
          name: 'World',
        })
        .expect(200)
        .expect('Hello World');
    }, 60000);
    it('should return "Hello Cong"', async () => {
      return request(app.getHttpServer())
        .get('/hello')
        .query({
          name: 'Cong',
        })
        .expect(200)
        .expect('Hello Cong');
    }, 60000);
  });
});
