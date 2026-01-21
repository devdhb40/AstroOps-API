import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { RouteEnum } from 'src/shared/enum/route.enum';
import { BaseResponse } from 'src/swagger/swagger.util';
import { MediaQueryDto } from './dtos/media-query.dto';
import { MediaItemDto } from './dtos/media-response.dto';
import type { MediaSearchResponseDto } from './dtos/media-response.dto';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller(RouteEnum.Media)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiOperation({
    summary: 'Buscar mídias na NASA Image and Video Library',
    description:
      'Realiza buscas na NASA Image and Video Library retornando imagens e vídeos espaciais. ' +
      'Suporta filtros por tipo de mídia, ano, centro da NASA e paginação. ' +
      'Os resultados são cacheados por 12 horas. ' +
      'Use os parâmetros `page` e `limit` para navegar pelos resultados.',
  })
  @BaseResponse(MediaItemDto, { paginated: true })
  async search(@Query() query: MediaQueryDto): Promise<MediaSearchResponseDto> {
    return this.mediaService.search(query);
  }
}
