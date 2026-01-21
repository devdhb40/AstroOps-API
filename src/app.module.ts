import { Module } from '@nestjs/common';

import { SwaggerModule } from 'src/swagger/swagger.module';
import { HealthModule } from './modules/health';
import { ApodModule } from './modules/apod/apod.module';

@Module({ imports: [SwaggerModule, HealthModule, ApodModule] })
export class AppModule {}
