import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RouteEnum } from 'src/shared/enum/route.enum';
import { BaseResponse } from 'src/swagger/swagger.util';
import { HealthService } from './health.service';
import { HealthResponseDto } from './dtos/health-response.dto';

@ApiTags('Health')
@Controller(RouteEnum.Health)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  // #region [Swagger]
  @ApiOperation({ summary: 'Check API health response' })
  @BaseResponse(HealthResponseDto)
  // #endregion
  async health(): Promise<HealthResponseDto> {
    return this.healthService.getHealth();
  }
}
