import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RouteEnum } from 'src/shared/enum/route.enum';
import { BaseResponse } from 'src/swagger/swagger.util';
import { AsteroidsDataResponseDto } from './dtos/asteroid-response.dto';
import { AsteroidsQueryDto } from './dtos/asteroids-query.dto';
import { AsteroidsService } from './asteroids.service';

@ApiTags('Asteroids')
@Controller(RouteEnum.Asteroids)
export class AsteroidsController {
  constructor(private readonly asteroidsService: AsteroidsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Asteroids',
    description:
      'Get near-Earth asteroids from NASA NeoWs Feed API. Maximum date range is 7 days.',
  })
  @BaseResponse(AsteroidsDataResponseDto)
  async getAsteroids(
    @Query() query: AsteroidsQueryDto,
  ): Promise<AsteroidsDataResponseDto> {
    const result = await this.asteroidsService.getAsteroids(query);

    return {
      data: result.data,
      meta: {
        cached: result.cached,
        range: {
          startDate: query.startDate,
          endDate: query.endDate || this.calculateDefaultEndDate(query.startDate),
        },
      },
    };
  }

  private calculateDefaultEndDate(startDate: string): string {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return end.toISOString().split('T')[0];
  }
}

