import { Injectable } from '@nestjs/common';

import { environment } from '@/shared/environment/environment';
import { HttpService } from '@/shared/libs/http/http.service';
import type { ApodInterface } from './interfaces/nasa.apod.interfaces';
import { ApodQueryDto } from './dtos/apod-query.dto';

@Injectable()
export class ApodRepository {
  constructor(private readonly httpService: HttpService) {}

  async getApod(params: ApodQueryDto): Promise<ApodInterface[]> {
    const queryString = this.buildQueryString(params);
    const url = `${environment.nasa.url}/planetary/apod?api_key=${environment.nasa.apiKey}&${queryString}`;
    const response = await this.httpService.get<
      ApodInterface | ApodInterface[]
    >(url);

    return Array.isArray(response) ? response : [response];
  }

  private buildQueryString(params: ApodQueryDto): string {
    const queryParams: string[] = [];

    if (params?.date) {
      queryParams.push(`date=${encodeURIComponent(params.date)}`);
    }

    if (params?.startDate) {
      queryParams.push(`start_date=${encodeURIComponent(params.startDate)}`);
    }

    if (params?.endDate) {
      queryParams.push(`end_date=${encodeURIComponent(params.endDate)}`);
    }

    if (params?.count !== undefined) {
      queryParams.push(`count=${params.count}`);
    }

    if (params?.thumbs) {
      queryParams.push(`thumbs=true`);
    }

    return queryParams.join('&');
  }
}
