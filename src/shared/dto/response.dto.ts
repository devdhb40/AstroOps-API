import { ApiExtraModels, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiErrorResponse } from '@/shared/dto/error.dto';
import { PaginationResponse } from '@/shared/dto/pagination.dto';

@ApiExtraModels(PaginationResponse)
export class ApiBaseResponse<T> {
  @ApiProperty({
    description: 'Indicates whether the request was processed successfully.',
    example: true,
  })
  success!: boolean;

  @ApiPropertyOptional({
    description:
      'Payload returned by the endpoint when `success` is `true`. ' +
      'It can be either the resource DTO itself or a paginated wrapper. ',
  })
  data?: T | PaginationResponse<T>;

  @ApiPropertyOptional({
    description: 'Payload returned by the endpoint when `success` is `false`. ',
    type: () => ApiErrorResponse,
  })
  error?: ApiErrorResponse;
}
