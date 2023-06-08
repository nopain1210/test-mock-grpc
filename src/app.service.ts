import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { HELLO_SERVICE_NAME, HelloClient } from './interface/hello';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  private helloService: HelloClient;

  constructor(@Inject(HELLO_SERVICE_NAME) private client: ClientGrpc) {}

  async sayHello(name: string): Promise<string> {
    const resp = await lastValueFrom(
      this.helloService.sayHello({
        name,
      }),
    );

    return resp.message;
  }

  onModuleInit() {
    this.helloService = this.client.getService<HelloClient>(HELLO_SERVICE_NAME);
  }
}
