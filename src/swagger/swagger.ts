import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { environment } from 'src/shared/environment/environment';
import { SwaggerAuthMiddleware } from 'src/swagger/swagger.middleware';

interface SwaggerOptions {
  title: string;
  description: string;
  endpoint: string;
  private?: boolean;
  modules?: (new (...args: any[]) => any)[];
}

function configureMainSwagger(app: INestApplication) {
  const options: SwaggerOptions = {
    title: 'Sentr.IA Core API',
    description: [
      'REST API reference for Sentr.IA services.',
      'Use Bearer JWT tokens on secured endpoints; unauthenticated requests are limited.',
      'Responses use standard HTTP status codes and error bodies with a message field.',
    ].join('\n'),
    endpoint: '/docs/api',
    private: true,
  };

  setSwagger(app, options);
}

function setSwagger(app: INestApplication, options: SwaggerOptions) {
  const config = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(options.description)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: options.modules ?? [],
  });

  if (options.private && !environment.isDevelopment)
    app.use(options.endpoint, new SwaggerAuthMiddleware().use);

  SwaggerModule.setup(options.endpoint, app, document, {
    customCssUrl: '/docs/swagger.css',
  });
}

export function setupSwagger(app: INestApplication) {
  configureMainSwagger(app);
}
