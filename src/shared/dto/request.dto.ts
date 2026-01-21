import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginateRequest {
  @ApiPropertyOptional({
    description: 'Page number (1-based).',
    default: 1,
    example: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page.',
    default: 20,
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({
    description: 'Field name to sort by.',
    example: 'createdAt',
    default: 'updatedAt',
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  sortBy: string = 'updatedAt';

  @ApiPropertyOptional({
    description: 'Sort direction.',
    enum: ['asc', 'desc'],
    example: 'desc',
    default: 'desc',
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  sortOrder: 'asc' | 'desc' = 'desc';
}
