import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export declare class JwtTokenService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    generateAccessToken(user: any): Promise<string>;
    generateRefreshToken(user: any): Promise<string>;
    verifyAccessToken(token: string): Promise<any>;
    verifyRefreshToken(token: string): Promise<any>;
}
