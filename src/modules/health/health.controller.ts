import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RouteEnum } from 'src/shared/enum/route.enum';
import { BaseResponse } from 'src/swagger/swagger.util';

@ApiTags('Health')
@Controller(RouteEnum.Health)
export class HealthController {
  @Get()
  // #region [Swagger]
  @ApiOperation({ summary: 'Check API health response' })
  @BaseResponse()
  // #endregion
  async health(): Promise<boolean> {
    return true;
  }
}
