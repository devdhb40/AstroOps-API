import { forwardRef, Module } from '@nestjs/common';

import { AsteroidsService } from './asteroids.service';
import { AsteroidsRepository } from './asteroids.repository';
import { HttpModule } from '@/shared/libs/http/http.module';
import { CacheModule } from '@/shared/libs/cache/cache.module';
import { AsteroidsController } from './asteroids.controller';

@Module({
  imports: [forwardRef(() => HttpModule), CacheModule],
  controllers: [AsteroidsController],
  providers: [AsteroidsService, AsteroidsRepository],
})
export class AsteroidsModule {}
