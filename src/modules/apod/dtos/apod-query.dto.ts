import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  Max,
  Min,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
  IsBoolean,
} from 'class-validator';

@ValidatorConstraint({ name: 'MutuallyExclusive', async: false })
export class MutuallyExclusiveConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    if (value === undefined) return true;

    const relatedProperties: string[] = args.constraints;
    const obj = args.object as Record<string, unknown>;

    return !relatedProperties.some((property) => obj[property] !== undefined);
  }

  defaultMessage(args: ValidationArguments): string {
    const relatedProperties: string[] = args.constraints;
    return `${args.property} cannot be used together with ${relatedProperties.join(
      ', ',
    )}`;
  }
}
export class ApodQueryDto {
  @ApiPropertyOptional({
    description: 'Date in YYYY-MM-DD format. Cannot be used with startDate.',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString({}, { message: 'date must be in YYYY-MM-DD format' })
  @Validate(MutuallyExclusiveConstraint, ['startDate'])
  date?: string;

  @ApiPropertyOptional({
    description:
      'Start date in YYYY-MM-DD format for date range. Cannot be used with date.',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString({}, { message: 'startDate must be in YYYY-MM-DD format' })
  @Validate(MutuallyExclusiveConstraint, ['date'])
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date in YYYY-MM-DD format. Used only with startDate.',
    example: '2024-01-31',
  })
  @IsOptional()
  @IsDateString({}, { message: 'endDate must be in YYYY-MM-DD format' })
  endDate?: string;

  @ApiPropertyOptional({
    description:
      'Number of random APOD images. Cannot be used with date or date range.',
    example: 5,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'count must be an integer' })
  @Min(1)
  @Max(100)
  @Validate(MutuallyExclusiveConstraint, ['date', 'startDate', 'endDate'])
  count?: number;

  @ApiPropertyOptional({
    description: 'When true, returns thumbnail URL if APOD is a video. Defaults to false.',
    example: true,
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'thumbs must be a boolean value' })
  thumbs: boolean = false;
}
