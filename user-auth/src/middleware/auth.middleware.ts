import { JwtTokenService } from './../jwt/jwt.service';
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtTokenService: JwtTokenService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            let access_token = req.cookies?.['access_token'];
            const refresh_token = req.cookies?.['refresh_token'];

            if (!access_token && !refresh_token) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }

            let user = null;
            if (access_token) {
                user = await this.jwtTokenService.verifyAccessToken(access_token);
            }

            if (!access_token || !user) {
                const refresh_token_data = await this.jwtTokenService.verifyRefreshToken(refresh_token);

                if (!refresh_token_data) {
                    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
                }

                access_token = await this.jwtTokenService.generateAccessToken(refresh_token_data.sub);

                res.cookie('access_token', access_token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: '/',
                    maxAge: 3600000,
                });

                user = await this.jwtTokenService.verifyAccessToken(access_token);
                if (!user) {
                    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
                }
            }

            req['user'] = user.sub;
            next();
        } catch (error) {
            return res.status(HttpStatus.UNAUTHORIZED).send({ message: error.message });
        }
    }
}
