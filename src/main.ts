import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { environment } from '@/shared/environment/environment';
import { ResponseInterceptor } from '@/shared/interceptor/response.interceptor';
import { setupSwagger } from '@/swagger/swagger';

async function bootstrap() {
  const logger = new Logger('NestApplication');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: environment.api.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  setupSwagger(app);

  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: true, value: true },
      transformOptions: { enableImplicitConversion: true },
    })
  );

  const port = environment.api.port;
  await app.listen(port);
  logger.log(`Listening on port: ${port}`);
}
bootstrap();
