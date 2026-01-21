import type { ApiErrorInterface } from 'src/shared/interface/error.interface';
import type { PaginationInterface } from 'src/shared/interface/pagination.interface';

export interface ApiBaseInterface<T> {
  success: boolean;
  data?: T | PaginationInterface<T>;
  error?: ApiErrorInterface;
}
