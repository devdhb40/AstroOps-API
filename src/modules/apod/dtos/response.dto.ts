import { ApiProperty } from '@nestjs/swagger';

export class ApodResponseDto {
  @ApiProperty({
    description: 'APOD date',
    example: '2026-01-21',
  })
  date: string;

  @ApiProperty({
    description: 'APOD description',
    example: 'A mere 56 million light-years distant toward the southern constellation Fornax...',
  })
  description: string;

  @ApiProperty({
    description: 'APOD image URL',
    example: 'https://apod.nasa.gov/apod/image/2601/OrionNebula_Hubble_960.jpg',
  })
  hdUrl: string;

  @ApiProperty({
    description: 'APOD media type',
    example: 'image',
  })
  mediaType: string;

  @ApiProperty({
    description: 'APOD service version',
    example: 'v1',
  })
  serviceVersion: string;

  @ApiProperty({
    description: 'APOD title',
    example: 'Orion Nebula',
  })
  title: string;

  @ApiProperty({
    description: 'APOD URL',
    example: 'https://apod.nasa.gov/apod/image/2601/OrionNebula_Hubble_960.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'APOD copyright',
    example: 'NASA, ESA, and the Hubble Heritage Team (STScI/AURA)-ESA/Hubble Collaboration',
  })
  copyright: string;
}
