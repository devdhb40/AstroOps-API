import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationResponse } from '@/shared/dto/pagination.dto';

export class MediaItemDto {
  @ApiProperty({
    description: 'Tipo de mídia',
    example: 'image',
    enum: ['image', 'video'],
  })
  mediaType: 'image' | 'video';

  @ApiProperty({
    description: 'ID único da NASA',
    example: 'PIA12345',
  })
  nasaId: string;

  @ApiProperty({
    description: 'Título da mídia',
    example: 'Mars Rover Landing',
  })
  title: string;

  @ApiProperty({
    description: 'Descrição da mídia',
    example: 'A view of Mars from the rover...',
  })
  description: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-15T00:00:00Z',
  })
  dateCreated: string;

  @ApiPropertyOptional({
    description: 'URL do thumbnail/preview',
    example: 'https://images-assets.nasa.gov/image/PIA12345/PIA12345~thumb.jpg',
  })
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'URL principal da mídia',
    example: 'https://images-assets.nasa.gov/image/PIA12345/PIA12345~large.jpg',
  })
  url: string;

  @ApiPropertyOptional({
    description: 'NASA center responsável',
    example: 'JPL',
  })
  center?: string;

  @ApiPropertyOptional({
    description: 'Palavras-chave',
    example: ['Mars', 'Rover', 'Exploration'],
    type: [String],
  })
  keywords?: string[];

  @ApiPropertyOptional({
    description: 'Fotógrafo',
    example: 'NASA/JPL-Caltech',
  })
  photographer?: string;

  @ApiPropertyOptional({
    description: 'Localização',
    example: 'Mars',
  })
  location?: string;
}

export class MediaSearchResponseDto extends PaginationResponse<MediaItemDto> {
  @ApiProperty({
    description: 'Total de resultados encontrados',
    example: 152,
  })
  totalHits: number;
}

