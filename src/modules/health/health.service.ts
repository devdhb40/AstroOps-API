import { Injectable, Logger } from '@nestjs/common';
import { HttpService as $HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '@/shared/environment/environment';
import { CacheService } from '@/shared/libs/cache/cache.service';
import { HealthResponseDto } from './dtos/health-response.dto';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly httpService: $HttpService,
    private readonly cacheService: CacheService,
  ) {}

  async getHealth(): Promise<HealthResponseDto> {
    const uptime = Math.floor(process.uptime());
    const timestamp = new Date().toISOString();

    const nasaApiStatus = await this.checkNasaApiStatus();

    const cacheStatus = await this.checkCacheStatus();

    return {
      status: 'ok',
      uptime,
      nasaApi: nasaApiStatus,
      cache: cacheStatus,
      timestamp,
    };
  }

  private async checkNasaApiStatus(): Promise<string> {
    try {
      const testUrl = `${environment.nasa.url}/planetary/apod?api_key=${environment.nasa.apiKey}&count=1`;
      const isUp = await firstValueFrom(
        this.httpService.get(testUrl).pipe(
          map(() => true),
          catchError(() => of(false)),
        ),
      );
      return isUp ? 'up' : 'down';
    } catch (error) {
      this.logger.warn('NASA API check failed', error);
      return 'down';
    }
  }

  private async checkCacheStatus(): Promise<string> {
    try {
      const testKey = '__health_check__';
      await this.cacheService.set(testKey, 'test', 1);
      const result = await this.cacheService.get(testKey);
      await this.cacheService.delete(testKey);

      if (result === 'test') {
        return 'up';
      }
      return 'down';
    } catch (error) {
      this.logger.warn('Cache check failed', error);
      return 'down';
    }
  }
}

