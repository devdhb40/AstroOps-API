import { Module } from '@nestjs/common';

import { SwaggerModule } from 'src/swagger/swagger.module';
import { HealthModule } from './modules/health';
import { ApodModule } from './modules/apod/apod.module';
import { AsteroidsModule } from './modules/asteroids/asteroids.module';
import { MediaModule } from './modules/media/media.module';

@Module({ imports: [SwaggerModule, HealthModule, ApodModule, AsteroidsModule, MediaModule] })
export class AppModule {}
