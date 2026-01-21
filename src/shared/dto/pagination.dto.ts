import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  PaginationInterface,
  PaginationMetadataInterface,
} from 'src/shared/interface/pagination.interface';

export class PaginationMetadataResponse implements PaginationMetadataInterface {
  @ApiProperty({ description: 'Selected page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items amount', example: 10 })
  limit: number;

  @ApiPropertyOptional({
    description: 'Total of itens on the database',
    example: 152,
  })
  total?: number;

  @ApiPropertyOptional({ description: 'Total of pages', example: 16 })
  totalPages?: number;
}

export class PaginationResponse<T> implements PaginationInterface<T> {
  @ApiProperty({ description: 'Paginated entities' })
  entities: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: () => PaginationMetadataResponse,
  })
  pagination: PaginationMetadataResponse;
}
