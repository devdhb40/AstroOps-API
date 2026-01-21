import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MessageResponse {
  constructor(message: string) {
    this.message = message;
  }

  @ApiProperty({
    description: 'Some success message',
    example: 'success.some.key',
  })
  @Expose()
  message: string;
}
