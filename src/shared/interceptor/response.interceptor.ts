import {
  type CallHandler,
  type ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { type Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MAPPER_KEY } from 'src/shared/decorator/mapper.decorator';
import type { ApiBaseResponse } from 'src/shared/dto/response.dto';
import { type MapperOptions, mapper } from 'src/shared/util/mapper.util';

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null;
}

function getHttpStatus(err: unknown): HttpStatus {
  if (err instanceof HttpException) return err.getStatus() as HttpStatus;
  return HttpStatus.INTERNAL_SERVER_ERROR;
}

function extractMessage(error: unknown): string {
  if (error instanceof HttpException) {
    const code = error.getStatus();

    if (code === HttpStatus.BAD_REQUEST) return 'error.bad_request';

    const _error = error.getResponse();

    if (typeof _error === 'string') return _error;

    if (isObject(_error)) {
      const message = _error.message;

      if (typeof message === 'string') return message;

      if (typeof (_error as Record<string, any>).error === 'string')
        return (_error as Record<string, any>).error;

      return 'error.request_failed';
    }

    return error.message || 'error.request_failed';
  }

  return 'error.internal_server_error';
}

function extractReason(error: unknown): string[] | undefined {
  if (error instanceof HttpException) {
    const code = error.getStatus();

    if (code !== HttpStatus.BAD_REQUEST) return;

    const _error = error.getResponse();

    if (typeof _error === 'string') return [_error];

    if (isObject(_error)) {
      const message = _error.message;

      if (typeof message === 'string') return [message];
      if (Array.isArray(message)) return message;

      if (typeof (_error as Record<string, any>).error === 'string')
        return [(_error as Record<string, any>).error];

      return ['unknown error'];
    }

    return [error.message || 'unknown error'];
  }

  return undefined;
}

function defaultMessageForStatus(status: HttpStatus): string {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return 'error.bad_request';
    case HttpStatus.UNAUTHORIZED:
      return 'error.unauthorized';
    case HttpStatus.FORBIDDEN:
      return 'error.forbidden';
    case HttpStatus.NOT_FOUND:
      return 'error.not_found';
    case HttpStatus.CONFLICT:
      return 'error.conflict';
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return 'error.unprocessable_entity';
    default:
      return status >= 500 ? 'error.internal_server_error' : 'error.request_failed';
  }
}

@Injectable()
export class ResponseInterceptor<Data = any> implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  constructor(private readonly reflector: Reflector) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();
    const path = req?.originalUrl ?? req?.url;
    const method = req?.method;

    return next.handle().pipe(
      map((data) => {
        const metadata = this.reflector.getAllAndOverride<{
          response: new (...args: any[]) => any;
          options?: MapperOptions;
        }>(MAPPER_KEY, [ctx.getHandler(), ctx.getClass()]);

        let meta: Record<string, any> | undefined;
        let responseData = data;

        if (isObject(data) && 'meta' in data) {
          meta = data.meta;
          responseData = { ...data };
          delete responseData.meta;
        }

        if (isObject(responseData) && responseData.data && Array.isArray(responseData.data)) {
          responseData = responseData.data;
        }

        if (metadata?.response) {
          if (Array.isArray(responseData)) {
            responseData = responseData.map((item) => mapper(metadata.response, item, metadata.options));
          } else if (isObject(responseData) && responseData.entities && Array.isArray(responseData.entities)) {
            responseData = {
              ...responseData,
              entities: responseData.entities.map((item: any) =>
                mapper(metadata.response, item, metadata.options)
              ),
            };
          } else if (isObject(responseData) && responseData.data) {
            const nestedData = responseData.data;
            if (Array.isArray(nestedData)) {
              responseData = nestedData.map((item: any) =>
                mapper(metadata.response, item, metadata.options)
              );
            } else {
              responseData = mapper(metadata.response, nestedData, metadata.options);
            }
          } else {
            responseData = mapper(metadata.response, responseData, metadata.options);
          }
        }

        const response: ApiBaseResponse<Data> = { success: true, data: responseData };
        if (meta !== undefined) {
          response.meta = meta;
        }

        return response;
      }),

      catchError((error) => {
        const code = getHttpStatus(error);
        const _extractedMessage = extractMessage(error);
        const _extractedReason = extractReason(error);

        const message = _extractedMessage?.length
          ? _extractedMessage
          : defaultMessageForStatus(code);

        if (code >= 500)
          this.logger.error(
            `${method ?? ''} ${path ?? ''} -> ${code}`,
            error instanceof Error ? error.stack : undefined
          );

        const response: ApiBaseResponse<Data> = {
          success: false,
          error: { code, message, reason: _extractedReason },
        };

        return throwError(() => new HttpException(response, code));
      })
    );
  }
}
