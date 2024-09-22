
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
    constructor(private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async generateAccessToken(user: any): Promise<string> {
        const payload = { sub: user };
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_TOKEN_AGE'),
        });
    }

    async generateRefreshToken(user: any): Promise<string> {
        const payload = { sub: user };
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_TOKEN_AGE'),
        }); 
    }

    async verifyAccessToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            });
        } catch (error) {
            
            return null
        }
    }


    async verifyRefreshToken(token: string): Promise<any> {
        try {
            const data = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            });
            return data
        } catch (error) {
            
            return null
        }
    }
}
