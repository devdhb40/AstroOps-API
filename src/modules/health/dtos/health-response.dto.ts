import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Status of the API',
    example: 'ok',
  })
  status: string;

  @ApiProperty({
    description: 'Uptime of the API',
    example: 100,
  })
  uptime: number;

  @ApiProperty({
    description: 'Status of the NASA API',
    example: 'up',
  })
  nasaApi: string;
  @ApiProperty({
    description: 'Status of the cache',
    example: 'up',
  })
  cache: string;
  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2026-01-21T12:00:00.000Z',
  })
  timestamp: string;
}
