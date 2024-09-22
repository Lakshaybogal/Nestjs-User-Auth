import { JwtTokenService } from './../jwt/jwt.service';
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SuperAdminMiddleware implements NestMiddleware {
    constructor(private readonly jwtTokenService: JwtTokenService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies['access_token'];
        const user = await this.jwtTokenService.verifyAccessToken(token);

        if (!user || user.sub.role !== 'SUPERADMIN') {
            return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Unauthorized' });
        }

        req['role'] = 'SUPERADMIN';
        next();
    }
}
