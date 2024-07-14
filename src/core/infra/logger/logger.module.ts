import { Module } from '@nestjs/common';
import { Request } from 'express';
import { ServerResponse, IncomingMessage } from 'http';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

import { EnvModule } from '../config/env/env.module';
import { EnvService } from '../config/env/env.service';
import { statusText } from './constants';
import { LoggerService } from './logger.service';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (env: EnvService) => {
        return {
          pinoHttp: {
            name: `${env.get('APP_NAME')}-logger`,
            level: env.get('NODE_ENV') !== 'production' ? 'debug' : 'info',
            genReqId: (req: IncomingMessage) =>
              req.headers['x-correlation-id'] ?? randomUUID(),
            customLogLevel(
              _: IncomingMessage,
              res: ServerResponse<IncomingMessage>,
              error: Error,
            ) {
              if (res.statusCode >= 400 && res.statusCode < 500) {
                return 'warn';
              }

              if (res.statusCode >= 500 || error) {
                return 'error';
              }

              return 'silent';
            },
            customSuccessMessage: function (
              _: IncomingMessage,
              res: ServerResponse,
            ) {
              return res.statusCode >= 400 && res.statusCode < 500
                ? `${res.statusCode} ${statusText[res.statusCode]}`
                : `${res.statusCode} ${statusText[res.statusCode]}`.trim();
            },
            customErrorMessage: function (
              _: IncomingMessage,
              res: ServerResponse<IncomingMessage>,
              error: Error,
            ) {
              return `${res.statusCode} ${statusText[res.statusCode]} ${
                error.message ? `- ${error.message}` : ''
              }`;
            },
            redact: ['document', 'email', 'password', 'password_confirmation'],
            transport:
              env.get('NODE_ENV') !== 'production'
                ? {
                    target: 'pino-pretty',
                    options: {
                      colorize: true,
                      levelFirst: true,
                      translateTime: true,
                    },
                  }
                : undefined,
            serializers: {
              req(req: Request) {
                req.body = req.body;

                return req;
              },
            },
            formatters: {
              level(level: string) {
                return { level };
              },
            },
          },
        };
      },
    }),
  ],
  providers: [LoggerService],
})
export class LoggerModule {}
