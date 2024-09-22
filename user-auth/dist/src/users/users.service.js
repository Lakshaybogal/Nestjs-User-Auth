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
exports.UsersService = void 0;
const jwt_service_1 = require("./../jwt/jwt.service");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prsima/prisma.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma, jwtTokenService) {
        this.prisma = prisma;
        this.jwtTokenService = jwtTokenService;
    }
    async getUsers(req, res) {
        try {
            if (req['role'] === 'SUPERADMIN') {
                const users = await this.prisma.user.findMany({
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                });
                return res.status(common_1.HttpStatus.OK).json({
                    message: 'Users retrieved successfully',
                    status: common_1.HttpStatus.OK,
                    data: users,
                });
            }
            const users = await this.prisma.user.findMany({
                where: {
                    role: {
                        not: client_1.Role.SUPERADMIN
                    }
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });
            return res.status(common_1.HttpStatus.OK).json({
                message: 'Users retrieved successfully',
                status: common_1.HttpStatus.OK,
                data: users,
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error retrieving users',
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async createUser(data, res) {
        try {
            if (!this.isValidEmail(data.email)) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    message: 'Invalid email format',
                    status: common_1.HttpStatus.BAD_REQUEST,
                });
            }
            const saltOrRounds = 10;
            const password = data.password;
            if (!password || password.length < 6) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    message: 'Password must be at least 6 characters long',
                    status: common_1.HttpStatus.BAD_REQUEST,
                });
            }
            const hash = await bcrypt.hash(password, saltOrRounds);
            const role = client_1.Role[data.role.toUpperCase()];
            if (!role) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    message: 'Invalid role provided',
                    status: common_1.HttpStatus.BAD_REQUEST,
                });
            }
            const user = await this.prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    role,
                    password: hash,
                },
            });
            if (!user) {
                return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Error creating user',
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                });
            }
            const access_token = await this.jwtTokenService.generateAccessToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            const refresh_token = await this.jwtTokenService.generateRefreshToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            res.cookie('access_token', access_token, {
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: 'none',
                expires: new Date(Date.now() + 1000 * 60 * 60),
            }).cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: 'none',
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            });
            return res.status(common_1.HttpStatus.CREATED).json({
                message: 'User created successfully',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                status: common_1.HttpStatus.CREATED,
            });
        }
        catch (error) {
            if (error instanceof client_2.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return res.status(common_1.HttpStatus.CONFLICT).json({
                        message: 'User already exists',
                        status: common_1.HttpStatus.CONFLICT,
                    });
                }
            }
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Error creating user',
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async getUser(email, password, res) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    password: true,
                },
            });
            if (!user) {
                return res.status(common_1.HttpStatus.NOT_FOUND).json({
                    message: 'User not found',
                    status: common_1.HttpStatus.NOT_FOUND,
                });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                    message: 'Invalid password',
                    status: common_1.HttpStatus.UNAUTHORIZED,
                });
            }
            const access_token = await this.jwtTokenService.generateAccessToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            const refresh_token = await this.jwtTokenService.generateRefreshToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            res.cookie('access_token', access_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
                expires: new Date(Date.now() + 60 * 60 * 1000),
            }).cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            return res.status(common_1.HttpStatus.OK).json({
                message: 'User logged in successfully',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                status: common_1.HttpStatus.OK,
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                message: error.message,
                status: common_1.HttpStatus.UNAUTHORIZED,
            });
        }
    }
    async getProfile(req, res) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: req['user'].id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        return res.status(common_1.HttpStatus.OK).json({
            message: 'User profile retrieved successfully',
            status: common_1.HttpStatus.OK,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    async logout(res) {
        try {
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            res.send('Logged out successfully');
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            });
        }
    }
    isValidEmail(email) {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRegex.test(email);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_service_1.JwtTokenService])
], UsersService);
//# sourceMappingURL=users.service.js.map