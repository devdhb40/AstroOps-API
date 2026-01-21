import { Injectable, BadRequestException } from '@nestjs/common';

import type { AsteroidsQueryDto } from './dtos/asteroids-query.dto';
import type { AsteroidResponseDto } from './dtos/asteroid-response.dto';
import { AsteroidsRepository } from './asteroids.repository';
import { AsteroidsMapper } from './asteroids.mapper';
import { CacheService } from '@/shared/libs/cache/cache.service';

@Injectable()
export class AsteroidsService {
  // TTL de 6 horas (21600 segundos)
  private readonly CACHE_TTL = 21600;

  constructor(
    private readonly asteroidsRepository: AsteroidsRepository,
    private readonly cache: CacheService,
  ) {}

  async getAsteroids(
    query: AsteroidsQueryDto,
  ): Promise<{ data: AsteroidResponseDto[]; cached: boolean }> {
    const params = this.applyDefaults(query);
    this.validateDateRange(params);

    const cacheKey = `asteroids:feed:${params.startDate}:${params.endDate}`;
    const cached = await this.cache.get<AsteroidResponseDto[]>(cacheKey);
    
    if (cached) {
      return { data: cached, cached: true };
    }

    const response = await this.asteroidsRepository.getAsteroids(params);
    const asteroids = AsteroidsMapper.toDto(response);

    await this.cache.set(cacheKey, asteroids, this.CACHE_TTL);

    return { data: asteroids, cached: false };
  }

  private applyDefaults(query: AsteroidsQueryDto): AsteroidsQueryDto {
    const params: AsteroidsQueryDto = {
      startDate: query.startDate,
    };

    if (query.endDate) {
      params.endDate = query.endDate;
    } else {
      const startDate = new Date(query.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
      params.endDate = endDate.toISOString().split('T')[0];
    }

    return params;
  }

  private validateDateRange(params: AsteroidsQueryDto): void {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate!);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      throw new BadRequestException(
        'Date range cannot exceed 7 days (NASA API limitation)',
      );
    }

    if (end < start) {
      throw new BadRequestException('endDate must be after or equal to startDate');
    }
  }
}

