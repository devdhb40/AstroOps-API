import { Injectable, NotFoundException } from '@nestjs/common';

import type { ApodInterface } from './interfaces/nasa.apod.interfaces';
import { ApodQueryDto } from './dtos/apod-query.dto';
import { ApodRepository } from './apod.repository';
import { CacheService } from '@/shared/libs/cache/cache.service';

@Injectable()
export class ApodService {
  constructor(
    private readonly apodRepository: ApodRepository,
    private readonly cache: CacheService,
  ) {}

  async getApod(query: ApodQueryDto): Promise<ApodInterface[]> {
    const params = this.applyDefaults(query);
    console.log(params);
    const apod = await this.apodRepository.getApod(params);

    if (!apod || (Array.isArray(apod) && apod.length === 0)) {
      throw new NotFoundException('error.apod.not_found');
    }
    return Array.isArray(apod) ? apod : [apod];
  }

  private applyDefaults(query: ApodQueryDto): ApodQueryDto {
    const today = new Date().toISOString().split('T')[0];

    const params: ApodQueryDto = {
      thumbs: query?.thumbs ?? false,
    };

    if (query?.count) {
      params.count = query.count;
      return params;
    }

    if (query?.date) {
      params.date = query.date;
      return params;
    }

    if (query?.startDate) {
      params.startDate = query.startDate;
      params.endDate = query.endDate ?? today;
      return params;
    }

    params.date = today;
    return params;
  }
}
