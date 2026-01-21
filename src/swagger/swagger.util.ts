import { applyDecorators, HttpStatus, type Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  type ApiPropertyOptions,
  ApiResponse,
  type ApiResponseNoStatusOptions,
  getSchemaPath,
} from '@nestjs/swagger';

import { MessageResponse } from '@/shared/dto/message.dto';
import { ApiBaseResponse } from '@/shared/dto/response.dto';
import type {
  PaginationInterface,
  PaginationMetadataInterface,
} from '@/shared/interface/pagination.interface';

type OpenApiNumberSchema = { type: 'number'; example?: number };

type OpenApiBooleanSchema = { type: 'boolean'; example?: boolean };

type OpenApiArraySchema<ItemSchema> = { type: 'array'; items: ItemSchema };

type OpenApiObjectSchema<Properties extends Record<string, any>> = {
  type: 'object';
  properties: Properties;
  required?: (keyof Properties & string)[];
};

type OpenApiStringSchema = { type: 'string'; example?: string };

type OpenApiStringArraySchema = {
  type: 'array';
  items: OpenApiStringSchema;
  example?: string[];
};

type OpenApiRefSchema = { $ref: string };

type ApiResponseSchema = Extract<ApiResponseNoStatusOptions, { schema: unknown }>['schema'];
type ApiResponseProperties = NonNullable<ApiResponseSchema['properties']>;
type ApiResponseProperty = ApiResponseProperties[string];

type PaginationMetadataSchema = OpenApiObjectSchema<{
  [K in keyof PaginationMetadataInterface]-?: OpenApiNumberSchema;
}> & {
  required: (keyof PaginationMetadataInterface & string)[];
};

type PaginationSchema<ItemSchema> = OpenApiObjectSchema<{
  [K in keyof PaginationInterface<any>]-?: K extends 'entities'
    ? OpenApiArraySchema<ItemSchema>
    : K extends 'pagination'
      ? PaginationMetadataSchema
      : never;
}> & {
  required: (keyof PaginationInterface<any> & string)[];
};

export type ApiErrorSchema = OpenApiObjectSchema<{
  code: OpenApiNumberSchema;
  message: OpenApiStringSchema;
  reason?: OpenApiStringArraySchema;
}> & {
  required: ('code' | 'message')[];
};

const buildErrorSchema = (code: number, message: string, reason?: string[]): ApiErrorSchema => {
  const properties: ApiErrorSchema['properties'] = {
    code: { type: 'number', example: code },
    message: { type: 'string', example: message },
  };

  if (reason !== undefined)
    properties.reason = {
      type: 'array',
      items: { type: 'string' },
      example: reason,
    };

  return {
    type: 'object',
    properties,
    required: ['code', 'message'],
  };
};

type ApiErrorResponseSchema = OpenApiObjectSchema<{
  success: OpenApiBooleanSchema;
  error: ApiErrorSchema;
}> & {
  required: ('success' | 'error')[];
};

type ErrorResponseExampleValue = {
  success: false;
  error: {
    code: number;
    message: string;
    reason?: string[];
  };
};

const buildErrorResponseSchema = (
  code: number,
  message: string,
  reason?: string[]
): ApiErrorResponseSchema => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    error: buildErrorSchema(code, message, reason),
  },
  required: ['success', 'error'],
});

const buildErrorResponseExampleValue = (
  code: number,
  message: string,
  reason?: string[]
): ErrorResponseExampleValue => ({
  success: false,
  error: {
    code,
    message,
    ...(reason !== undefined ? { reason } : {}),
  },
});

const buildErrorResponseExamples = (code: number, messages: string[], reason?: string[]) => {
  const examples: Record<string, { summary: string; value: ErrorResponseExampleValue }> = {};
  const usedNames = new Set<string>();

  messages.forEach((message, index) => {
    const baseName = message || `Error${index + 1}`;
    let name = baseName;
    let suffix = 1;

    while (usedNames.has(name)) {
      suffix += 1;
      name = `${baseName}_${suffix}`;
    }

    usedNames.add(name);
    examples[name] = {
      summary: message,
      value: buildErrorResponseExampleValue(code, message, reason),
    };
  });

  return examples;
};

const buildPaginationSchema = <Model extends Type<any>>(
  model: Model
): PaginationSchema<OpenApiRefSchema> => ({
  type: 'object',
  properties: {
    entities: {
      type: 'array',
      items: { $ref: getSchemaPath(model) },
    },
    pagination: {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        total: { type: 'number', example: 152 },
        totalPages: { type: 'number', example: 16 },
      },
      required: ['page', 'limit', 'total', 'totalPages'],
    },
  },
  required: ['entities', 'pagination'],
});

const buildMessageSchema = (
  messageExample?: string
): OpenApiObjectSchema<{
  message: OpenApiStringSchema;
}> => ({
  type: 'object',
  properties: {
    message: {
      type: 'string',
      ...(messageExample !== undefined ? { example: messageExample } : {}),
    },
  },
  required: ['message'],
});

export const BaseResponse = <Model extends Type<any>>(
  model?: Model,
  options?: {
    description?: string;
    isArray?: boolean;
    paginated?: boolean;
    created?: boolean;
    messageExample?: string;
  }
) => {
  const {
    description = undefined,
    paginated = false,
    created = false,
    isArray = false,
    messageExample = undefined,
  } = options ?? {};

  const isMessageResponse = model === MessageResponse;
  const data: ApiResponseProperty | undefined = model
    ? isMessageResponse && messageExample !== undefined
      ? buildMessageSchema(messageExample)
      : paginated
        ? buildPaginationSchema<Model>(model)
        : isArray
          ? { type: 'array', items: { $ref: getSchemaPath(model) } }
          : { $ref: getSchemaPath(model) }
    : undefined;

  const properties: ApiResponseProperties = {
    success: { type: 'boolean', example: true },
  };

  if (data) properties.data = data;

  const schema: ApiResponseNoStatusOptions = {
    description,
    schema: {
      type: 'object',
      properties,
      required: ['success'],
    },
  };

  return applyDecorators(
    model ? ApiExtraModels(ApiBaseResponse, model) : ApiExtraModels(ApiBaseResponse),
    created ? ApiCreatedResponse(schema) : ApiOkResponse(schema)
  );
};

type BaseErrorOptions =
  | {
      description?: string;
      message: string;
      reason?: string[];
      messages?: never;
    }
  | {
      description?: string;
      messages: string[];
      reason?: string[];
      message?: never;
    };

const resolveErrorMessages = (options: BaseErrorOptions): string[] =>
  'messages' in options ? (options.messages ?? []) : [options.message];

const ErrorResponseBase = (options: BaseErrorOptions, code: number) => {
  const messages = resolveErrorMessages(options);

  if (messages.length > 1)
    return ApiResponse({
      status: code,
      description: options.description,
      content: {
        'application/json': {
          schema: {
            oneOf: messages.map((message) =>
              buildErrorResponseSchema(code, message, options.reason)
            ),
          },
          examples: buildErrorResponseExamples(code, messages, options.reason),
        },
      },
    });

  return ApiResponse({
    status: code,
    description: options.description,
    schema: buildErrorResponseSchema(code, messages[0], options.reason),
  });
};

export const BaseNotFoundResponse = (options: BaseErrorOptions) =>
  ErrorResponseBase(options, HttpStatus.NOT_FOUND);

export const BaseInternalServerErrorResponse = (options: BaseErrorOptions) =>
  ErrorResponseBase(options, HttpStatus.INTERNAL_SERVER_ERROR);

export const BaseUnprocessableEntityResponse = (options: BaseErrorOptions) =>
  ErrorResponseBase(options, HttpStatus.UNPROCESSABLE_ENTITY);

export const BaseUnauthorizedResponse = (options: BaseErrorOptions) =>
  ErrorResponseBase(options, HttpStatus.UNAUTHORIZED);

export const BaseConflictResponse = (options: BaseErrorOptions) =>
  ErrorResponseBase(options, HttpStatus.CONFLICT);

export const BaseBadRequestResponse = (options: BaseErrorOptions) =>
  ErrorResponseBase(options, HttpStatus.BAD_REQUEST);

export const BaseTooManyRequestsResponse = (options: BaseErrorOptions) =>
  ErrorResponseBase(options, HttpStatus.TOO_MANY_REQUESTS);

export const ApiPropertyEnum = ({
  enum: enumObject,
  dictionary = {},
  ...options
}: {
  enum: object;
  dictionary?: object;
} & ApiPropertyOptions) =>
  ApiProperty({
    description: options.description,
    enum: enumObject,
    examples: Object.fromEntries(Object.entries(dictionary)),
    ...options,
  });
