import { Module } from '@nestjs/common';
import { HttpModule as $HttpModule } from '@nestjs/axios';

import { HealthController } from 'src/modules/health/health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [$HttpModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
