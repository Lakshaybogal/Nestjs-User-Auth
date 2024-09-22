import { JwtTokenService } from './../jwt/jwt.service';
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
    constructor(private readonly jwtTokenService: JwtTokenService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const access_token = req.cookies['access_token'];
        const user = await this.jwtTokenService.verifyAccessToken(access_token);

        if (!user || (user.sub.role !== 'ADMIN' && user.sub.role !== 'SUPERADMIN')) {
            return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Unauthorized' });
        }

        req['role'] = 'ADMIN';
        next();
    }
}
