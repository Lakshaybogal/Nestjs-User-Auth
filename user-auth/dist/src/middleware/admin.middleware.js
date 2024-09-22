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
exports.AdminMiddleware = void 0;
const jwt_service_1 = require("./../jwt/jwt.service");
const common_1 = require("@nestjs/common");
let AdminMiddleware = class AdminMiddleware {
    constructor(jwtTokenService) {
        this.jwtTokenService = jwtTokenService;
    }
    async use(req, res, next) {
        const access_token = req.cookies['access_token'];
        const user = await this.jwtTokenService.verifyAccessToken(access_token);
        if (!user || (user.sub.role !== 'ADMIN' && user.sub.role !== 'SUPERADMIN')) {
            return res.status(common_1.HttpStatus.UNAUTHORIZED).send({ message: 'Unauthorized' });
        }
        req['role'] = 'ADMIN';
        next();
    }
};
exports.AdminMiddleware = AdminMiddleware;
exports.AdminMiddleware = AdminMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtTokenService])
], AdminMiddleware);
//# sourceMappingURL=admin.middleware.js.map