import { Module } from '@nestjs/common';

import { SwaggerModule } from 'src/swagger/swagger.module';
import { HealthModule } from './modules/health';

@Module({ imports: [SwaggerModule, HealthModule] })
export class AppModule {}
