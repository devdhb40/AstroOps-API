import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import type { MediaQueryDto } from './dtos/media-query.dto';
import type { MediaSearchResponseDto } from './dtos/media-response.dto';
import { MediaRepository } from './media.repository';
import { MediaMapper } from './media.mapper';
import { CacheService } from '@/shared/libs/cache/cache.service';

@Injectable()
export class MediaService {
  private readonly CACHE_TTL = 43200; // 12 horas em segundos

  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly cache: CacheService,
  ) {}

  async search(query: MediaQueryDto): Promise<MediaSearchResponseDto> {
    if (!query.q || query.q.trim().length === 0) {
      throw new BadRequestException('error.media.query_required');
    }

    if (query.yearStart && query.yearEnd && query.yearStart > query.yearEnd) {
      throw new BadRequestException('error.media.invalid_year_range');
    }

    const params = this.applyDefaults(query);
    const cacheKey = this.buildCacheKey(params);

    const cached = await this.cache.get<Omit<MediaSearchResponseDto, 'cached'>>(cacheKey);
    if (cached) {
      return { ...cached, cached: true };
    }

    const rawResponse = await this.mediaRepository.search(params);

    if (
      !rawResponse.collection.items ||
      rawResponse.collection.items.length === 0
    ) {
      throw new NotFoundException('error.media.no_results');
    }

    const result = MediaMapper.toDto(
      rawResponse,
      params.page ?? 1,
      params.limit ?? 20,
    );

    await this.cache.set(cacheKey, result, this.CACHE_TTL);

    return { ...result, cached: false };
  }

  private buildCacheKey(params: MediaQueryDto): string {
    const parts: string[] = ['media', 'search'];

    parts.push(params.q);
    parts.push(params.mediaType ?? '');
    parts.push(params.yearStart?.toString() ?? '');
    parts.push(params.yearEnd?.toString() ?? '');
    parts.push((params.page ?? 1).toString());

    return parts.join(':');
  }

  private applyDefaults(query: MediaQueryDto): MediaQueryDto {
    return {
      ...query,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    };
  }
}

