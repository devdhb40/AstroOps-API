import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../assets/public/swagger'),
      serveRoot: '/docs',
    }),
  ],
})
export class SwaggerModule {}
