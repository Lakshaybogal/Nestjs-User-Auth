import { JwtTokenService } from './../jwt/jwt.service';
import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class AuthMiddleware implements NestMiddleware {
    private readonly jwtTokenService;
    constructor(jwtTokenService: JwtTokenService);
    use(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
