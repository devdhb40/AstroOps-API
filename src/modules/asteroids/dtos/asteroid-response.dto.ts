import { ApiProperty } from '@nestjs/swagger';

export class EstimatedDiameterDto {
  @ApiProperty({
    description: 'Minimum estimated diameter in kilometers',
    example: 0.1234,
  })
  min: number;

  @ApiProperty({
    description: 'Maximum estimated diameter in kilometers',
    example: 0.2762,
  })
  max: number;
}

export class CloseApproachDto {
  @ApiProperty({
    description: 'Distance from Earth in kilometers',
    example: '45000000',
  })
  distanceKm: string;

  @ApiProperty({
    description: 'Velocity in kilometers per hour',
    example: '54000',
  })
  velocityKmh: string;
}

export class AsteroidResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the asteroid',
    example: '2021277',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the asteroid',
    example: '21277 (1996 TO5)',
  })
  name: string;

  @ApiProperty({
    description: 'Date of close approach in YYYY-MM-DD format',
    example: '2024-01-15',
  })
  date: string;

  @ApiProperty({
    description: 'Estimated diameter in kilometers',
    type: EstimatedDiameterDto,
  })
  estimatedDiameterKm: EstimatedDiameterDto;

  @ApiProperty({
    description: 'Whether the asteroid is potentially hazardous',
    example: false,
  })
  isPotentiallyHazardous: boolean;

  @ApiProperty({
    description: 'Close approach data',
    type: CloseApproachDto,
  })
  closeApproach: CloseApproachDto;
}

export class AsteroidMetaDto {
  @ApiProperty({
    description: 'Whether the data is from cache',
    example: false,
  })
  cached: boolean;

  @ApiProperty({
    description: 'Date range of the query',
    example: {
      startDate: '2024-01-15',
      endDate: '2024-01-22',
    },
  })
  range: {
    startDate: string;
    endDate: string;
  };
}

export class AsteroidsDataResponseDto {
  @ApiProperty({
    description: 'List of asteroids',
    type: [AsteroidResponseDto],
  })
  data: AsteroidResponseDto[];

  @ApiProperty({
    description: 'Metadata about the response',
    type: AsteroidMetaDto,
  })
  meta: AsteroidMetaDto;
}
