import { Injectable, type NestMiddleware, UnauthorizedException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import { environment } from 'src/shared/environment/environment';

@Injectable()
export class SwaggerAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const getCredentials = (res: Response) => {
      res.setHeader('WWW-Authenticate', 'Basic');
      throw new UnauthorizedException({
        key: 'unauthorized_access_to_swagger',
      });
    };

    const authHeader = req.headers.authorization;
    if (!authHeader) getCredentials(res);

    const [type, credentials] = authHeader?.split(' ') ?? [];
    if (type !== 'Basic' || !credentials) getCredentials(res);

    const decoded = Buffer.from(credentials, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');

    const authorized =
      username === environment.swagger.user && password === environment.swagger.password;

    if (!authorized) getCredentials(res);

    next();
  }
}
