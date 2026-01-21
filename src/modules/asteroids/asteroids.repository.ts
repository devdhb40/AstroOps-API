import { Injectable } from '@nestjs/common';

import { environment } from '@/shared/environment/environment';
import { HttpService } from '@/shared/libs/http/http.service';
import type { NasaAsteroidsResponse } from './interfaces/nasa-asteroids.interface';
import type { AsteroidsQueryDto } from './dtos/asteroids-query.dto';

@Injectable()
export class AsteroidsRepository {
  constructor(private readonly httpService: HttpService) {}

  async getAsteroids(
    params: AsteroidsQueryDto,
  ): Promise<NasaAsteroidsResponse> {
    const queryString = this.buildQueryString(params);
    const url = `${environment.nasa.url}/neo/rest/v1/feed?api_key=${environment.nasa.apiKey}&${queryString}`;
    
    const response = await this.httpService.get<NasaAsteroidsResponse>(url);
    return response;
  }

  private buildQueryString(params: AsteroidsQueryDto): string {
    const queryParams: string[] = [];

    if (params.startDate) {
      queryParams.push(`start_date=${encodeURIComponent(params.startDate)}`);
    }

    if (params.endDate) {
      queryParams.push(`end_date=${encodeURIComponent(params.endDate)}`);
    }

    return queryParams.join('&');
  }
}
