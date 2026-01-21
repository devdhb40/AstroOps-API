import { Injectable, BadGatewayException, HttpException } from '@nestjs/common';

import { HttpService } from '@/shared/libs/http/http.service';
import type { NasaSearchResponse } from './interfaces/nasa-media-search.interface';
import type { MediaQueryDto } from './dtos/media-query.dto';

@Injectable()
export class MediaRepository {
  private readonly BASE_URL = 'https://images-api.nasa.gov/search';

  constructor(private readonly httpService: HttpService) {}

  async search(params: MediaQueryDto): Promise<NasaSearchResponse> {
    const queryParams = this.buildQueryParams(params);
    const url = `${this.BASE_URL}?${queryParams}`;

    try {
      const response = await this.httpService.get<NasaSearchResponse>(url);
      return response;
    } catch (error) {
      if (error instanceof HttpException && error.getStatus() === 502) {
        throw error;
      }
      throw new BadGatewayException('error.nasa.api_unavailable');
    }
  }

  private buildQueryParams(params: MediaQueryDto): string {
    const queryParams: string[] = [];

    queryParams.push(`q=${encodeURIComponent(params.q)}`);

    if (params.mediaType) {
      queryParams.push(`media_type=${encodeURIComponent(params.mediaType)}`);
    }

    if (params.yearStart) {
      queryParams.push(`year_start=${params.yearStart}`);
    }

    if (params.yearEnd) {
      queryParams.push(`year_end=${params.yearEnd}`);
    }

    if (params.center) {
      queryParams.push(`center=${encodeURIComponent(params.center)}`);
    }

    if (params.page) {
      queryParams.push(`page=${params.page}`);
    }

    if (params.limit) {
      queryParams.push(`page_size=${params.limit}`);
    }

    return queryParams.join('&');
  }
}

