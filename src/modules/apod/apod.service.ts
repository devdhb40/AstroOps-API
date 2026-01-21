import { Injectable, NotFoundException } from '@nestjs/common';

import type { ApodInterface } from './interfaces/nasa.apod.interfaces';
import { ApodQueryDto } from './dtos/apod-query.dto';
import { ApodRepository } from './apod.repository';
import { CacheService } from '@/shared/libs/cache/cache.service';

@Injectable()
export class ApodService {
  private readonly CACHE_TTL = 21600; // 6 horas

  constructor(
    private readonly apodRepository: ApodRepository,
    private readonly cache: CacheService,
  ) {}

  async getApod(query: ApodQueryDto): Promise<{ items: ApodInterface[]; cached: boolean }> {
    const params = this.applyDefaults(query);
    const cacheKey = this.buildCacheKey(params);

    const cached = await this.cache.get<ApodInterface[]>(cacheKey);
    if (cached) {
      return { items: cached, cached: true };
    }

    const apod = await this.apodRepository.getApod(params);

    if (!apod || (Array.isArray(apod) && apod.length === 0)) {
      throw new NotFoundException('error.apod.not_found');
    }

    const result = Array.isArray(apod) ? apod : [apod];
    await this.cache.set(cacheKey, result, this.CACHE_TTL);

    return { items: result, cached: false };
  }

  private buildCacheKey(params: ApodQueryDto): string {
    const parts: string[] = ['apod'];

    if (params.date) {
      parts.push(`date:${params.date}`);
    } else if (params.startDate) {
      parts.push(`range:${params.startDate}:${params.endDate || ''}`);
    } else if (params.count) {
      parts.push(`count:${params.count}`);
    }

    if (params.thumbs) {
      parts.push('thumbs:true');
    }

    return parts.join(':');
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
