import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { RouteEnum } from 'src/shared/enum/route.enum';
import { BaseResponse } from 'src/swagger/swagger.util';
import { ApodResponseDto } from './dtos/response.dto';
import { ApodQueryDto } from './dtos/apod-query.dto';
import { ApodService } from './apod.service';
import { ApodMapper } from './apod.mapper';

@ApiTags('Apods')
@Controller(RouteEnum.Apods)
export class ApodController {
  constructor(private readonly apodService: ApodService) {}

  @Get()
  @ApiOperation({ summary: 'Get APOD', description: 'Get APOD by query' })
  @BaseResponse(ApodResponseDto)
  @ApiQuery({ type: ApodQueryDto })
  async getApod(query: ApodQueryDto): Promise<ApodResponseDto[]> {
    const apod = await this.apodService.getApod(query);
    return apod.map((item) => ApodMapper.toDto(item));
  }
}
