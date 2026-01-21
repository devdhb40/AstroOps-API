import { HttpModule as $HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { HttpService } from '@/shared/libs/http/http.service';

@Module({
  imports: [$HttpModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
