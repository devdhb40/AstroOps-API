import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { ApiErrorInterface } from '@/shared/interface/error.interface';

export class ApiErrorResponse implements ApiErrorInterface {
  @ApiProperty({ description: 'Error code' })
  code: number;

  @ApiProperty({ description: 'Error message key' })
  message: string;

  @ApiPropertyOptional({ description: 'Error message reason (when appliable)' })
  reason?: string[];
}
