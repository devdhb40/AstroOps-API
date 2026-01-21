import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class AsteroidsQueryDto {
  @ApiProperty({
    description: 'Start date in YYYY-MM-DD format',
    example: '2024-01-15',
  })
  @IsDateString({}, { message: 'startDate must be in YYYY-MM-DD format' })
  startDate: string;

  @ApiPropertyOptional({
    description:
      'End date in YYYY-MM-DD format. Defaults to startDate + 7 days. Max range is 7 days.',
    example: '2024-01-22',
  })
  @IsOptional()
  @IsDateString({}, { message: 'endDate must be in YYYY-MM-DD format' })
  endDate?: string;
}
