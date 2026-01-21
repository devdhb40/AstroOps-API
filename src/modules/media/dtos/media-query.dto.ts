import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';

export class MediaQueryDto {
  @ApiProperty({
    description: 'Termo de busca',
    example: 'Mars',
    required: true,
  })
  @IsString({ message: 'q must be a string' })
  @IsNotEmpty({ message: 'q is required' })
  q: string;

  @ApiPropertyOptional({
    description: 'Tipo de mídia: image ou video',
    example: 'image',
    enum: ['image', 'video'],
  })
  @IsOptional()
  @IsEnum(['image', 'video'], { message: 'mediaType must be either "image" or "video"' })
  mediaType?: 'image' | 'video';

  @ApiPropertyOptional({
    description: 'Ano inicial para filtrar resultados',
    example: 1969,
    minimum: 1900,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'yearStart must be an integer' })
  @Min(1900, { message: 'yearStart must be at least 1900' })
  yearStart?: number;

  @ApiPropertyOptional({
    description: 'Ano final para filtrar resultados',
    example: 2024,
    minimum: 1900,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'yearEnd must be an integer' })
  @Min(1900, { message: 'yearEnd must be at least 1900' })
  yearEnd?: number;

  @ApiPropertyOptional({
    description: 'NASA center (ex: JPL, GSFC)',
    example: 'JPL',
  })
  @IsOptional()
  @IsString({ message: 'center must be a string' })
  center?: string;

  @ApiPropertyOptional({
    description: 'Número da página',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Número de resultados por página',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be at least 1' })
  @Max(100, { message: 'limit must be at most 100' })
  limit?: number = 20;
}

