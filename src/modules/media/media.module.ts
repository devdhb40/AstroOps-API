import { forwardRef, Module } from '@nestjs/common';

import { MediaService } from './media.service';
import { MediaRepository } from './media.repository';
import { HttpModule } from '@/shared/libs/http/http.module';
import { CacheModule } from '@/shared/libs/cache/cache.module';
import { MediaController } from './media.controller';

@Module({
  imports: [forwardRef(() => HttpModule), CacheModule],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository],
})
export class MediaModule {}

