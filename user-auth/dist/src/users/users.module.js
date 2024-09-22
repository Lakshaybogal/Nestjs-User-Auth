"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const prisma_module_1 = require("../prsima/prisma.module");
const jwt_module_1 = require("../jwt/jwt.module");
const superadmin_middleware_1 = require("../middleware/superadmin.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
let UsersModule = class UsersModule {
    configure(consumer) {
        consumer
            .apply(auth_middleware_1.AuthMiddleware)
            .exclude({ path: '/users/auth/login', method: common_1.RequestMethod.ALL })
            .exclude({ path: '/users/auth/register', method: common_1.RequestMethod.ALL })
            .exclude({ path: '/users/auth/logout', method: common_1.RequestMethod.ALL })
            .forRoutes({ path: '/users/*', method: common_1.RequestMethod.ALL })
            .apply(superadmin_middleware_1.SuperAdminMiddleware)
            .forRoutes({ path: '/users/superadmin', method: common_1.RequestMethod.GET })
            .apply(admin_middleware_1.AdminMiddleware)
            .forRoutes({ path: '/users/admin', method: common_1.RequestMethod.GET });
    }
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, jwt_module_1.JwtTokenModule],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map