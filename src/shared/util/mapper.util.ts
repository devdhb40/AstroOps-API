import { type ClassConstructor, plainToInstance } from 'class-transformer';

import { getArrayElementType } from 'src/shared/decorator/array.decorator';

export interface MapperOptions {
  groups?: string[];
  exclude?: boolean;
}

export const mapper = <T, V>(cls: ClassConstructor<T>, plain: V, options?: MapperOptions): T => {
  const innerMapper = (targetCls: any, obj: any) => {
    if (!obj || typeof obj !== 'object') return obj;

    if (typeof targetCls === 'function' && targetCls !== Object) {
      const instance = plainToInstance(targetCls, obj, {
        excludeExtraneousValues: options?.exclude ?? true,
        groups: options?.groups,
      });

      for (const key of Object.keys(obj)) {
        if (!Object.hasOwn(instance, key)) continue;
        const value = obj[key];

        if (value && typeof value === 'object')
          if (Array.isArray(value)) {
            const elementType = getArrayElementType(instance, key) ?? Object;

            instance[key] = value.map((_value: any) => innerMapper(elementType, _value));
          } else {
            const designType = Reflect.getMetadata('design:type', targetCls.prototype, key);

            if (designType) instance[key] = innerMapper(designType, value);
          }
      }

      return instance;
    }

    return obj;
  };

  return plainToInstance(cls, innerMapper(cls, plain), {
    excludeExtraneousValues: options?.exclude ?? true,
    groups: options?.groups,
  });
};
