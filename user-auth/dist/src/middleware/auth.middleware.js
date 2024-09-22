"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jwt_service_1 = require("./../jwt/jwt.service");
const common_1 = require("@nestjs/common");
let AuthMiddleware = class AuthMiddleware {
    constructor(jwtTokenService) {
        this.jwtTokenService = jwtTokenService;
    }
    async use(req, res, next) {
        try {
            let access_token = req.cookies?.['access_token'];
            const refresh_token = req.cookies?.['refresh_token'];
            if (!access_token && !refresh_token) {
                throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
            }
            let user = null;
            if (access_token) {
                user = await this.jwtTokenService.verifyAccessToken(access_token);
            }
            if (!access_token || !user) {
                const refresh_token_data = await this.jwtTokenService.verifyRefreshToken(refresh_token);
                if (!refresh_token_data) {
                    throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
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
                    throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
                }
            }
            req['user'] = user.sub;
            next();
        }
        catch (error) {
            return res.status(common_1.HttpStatus.UNAUTHORIZED).send({ message: error.message });
        }
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtTokenService])
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map