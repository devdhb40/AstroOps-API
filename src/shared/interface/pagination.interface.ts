export interface EntitiesInterface<T> {
  entities: T[];
  total?: number;
}

export interface PaginationMetadataInterface {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

export interface PaginationInterface<T> {
  entities: T[];
  pagination: PaginationMetadataInterface;
}
