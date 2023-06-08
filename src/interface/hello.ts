/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'hello';

export interface SayHelloRequest {
  name: string;
}

export interface SayHelloReply {
  message: string;
}

export const HELLO_PACKAGE_NAME = 'hello';

export interface HelloClient {
  sayHello(request: SayHelloRequest, ...rest: any): Observable<SayHelloReply>;
}

export interface HelloController {
  sayHello(
    request: SayHelloRequest,
    ...rest: any
  ): Promise<SayHelloReply> | Observable<SayHelloReply> | SayHelloReply;
}

export function HelloControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['sayHello'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('Hello', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('Hello', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const HELLO_SERVICE_NAME = 'Hello';
