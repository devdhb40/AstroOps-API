import { Module } from '@nestjs/common';

import { SwaggerModule } from 'src/swagger/swagger.module';
import { HealthModule } from './modules/health';
import { ApodModule } from './modules/apod/apod.module';
import { AsteroidsModule } from './modules/asteroids/asteroids.module';

@Module({ imports: [SwaggerModule, HealthModule, ApodModule, AsteroidsModule] })
export class AppModule {}
