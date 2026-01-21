import { forwardRef, Module } from '@nestjs/common';

import { ApodService } from './apod.service';
import { ApodRepository } from './apod.repository';
import { HttpModule } from '@/shared/libs/http/http.module';
import { CacheModule } from '@/shared/libs/cache/cache.module';
import { ApodController } from './apod.controller';

@Module({
  imports: [forwardRef(() => HttpModule), CacheModule],
  controllers: [ApodController],
  providers: [ApodService, ApodRepository],
})
export class ApodModule {}
