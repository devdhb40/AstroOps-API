import { SetMetadata } from '@nestjs/common';
import type { ClassConstructor } from 'class-transformer';
import type { MapperOptions } from '@/shared/util/mapper.util';

export const MAPPER_KEY = 'mapper:response';

export const Mapper = (response: ClassConstructor<any>, options?: MapperOptions) =>
  SetMetadata(MAPPER_KEY, { response, options });
