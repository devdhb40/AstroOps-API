import 'reflect-metadata';

const ARRAY_TYPE_METADATA_KEY = Symbol('array:type');

export function ArrayType(typeFn: () => new (...args: any[]) => any): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(ARRAY_TYPE_METADATA_KEY, typeFn, target, propertyKey);
  };
}

export function getArrayElementType(
  target: any,
  propertyKey: string
): (new (...args: any[]) => any) | undefined {
  const typeFn = Reflect.getMetadata(ARRAY_TYPE_METADATA_KEY, target, propertyKey);
  return typeof typeFn === 'function' ? typeFn() : undefined;
}
