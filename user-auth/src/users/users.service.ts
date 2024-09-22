import { JwtTokenService } from './../jwt/jwt.service';
import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prsima/prisma.service';
import { Request, Response } from 'express';

import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtTokenService: JwtTokenService
    ) { }

    async getUsers(req: Request, res: Response) {
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
                return res.status(HttpStatus.OK).json({
                    message: 'Users retrieved successfully',
                    status: HttpStatus.OK,
                    data: users,
                });
            }
            const users = await this.prisma.user.findMany({
                where: {
                    role: {
                        not: Role.SUPERADMIN
                    }
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });
            return res.status(HttpStatus.OK).json({
                message: 'Users retrieved successfully',
                status: HttpStatus.OK,
                data: users,
            });

        }
        catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error retrieving users',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async createUser(data: CreateUserDto, res: Response) {
        try {
            if (!this.isValidEmail(data.email)) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Invalid email format',
                    status: HttpStatus.BAD_REQUEST,
                });
            }

            const saltOrRounds = 10;
            const password = data.password;

            if (!password || password.length < 6) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Password must be at least 6 characters long',
                    status: HttpStatus.BAD_REQUEST,
                });
            }

            const hash = await bcrypt.hash(password, saltOrRounds);
            const role = Role[data.role.toUpperCase() as keyof typeof Role];

            if (!role) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Invalid role provided',
                    status: HttpStatus.BAD_REQUEST,
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
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Error creating user',
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
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
            })
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
            })
            return res.status(HttpStatus.CREATED).json({
                message: 'User created successfully',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                status: HttpStatus.CREATED,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return res.status(HttpStatus.CONFLICT).json({
                        message: 'User already exists',
                        status: HttpStatus.CONFLICT,
                    });
                }
            }

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Error creating user',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            });
        }
    }

    async getUser(email: string, password: string, res: Response): Promise<Response> {
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
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'User not found',
                    status: HttpStatus.NOT_FOUND,
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: 'Invalid password',
                    status: HttpStatus.UNAUTHORIZED,
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
            })
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
            })

            return res.status(HttpStatus.OK).json({
                message: 'User logged in successfully',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                status: HttpStatus.OK,
            });
        } catch (error) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: error.message,
                status: HttpStatus.UNAUTHORIZED,
            });
        }
    }

    async getProfile(req: Request, res: Response) {
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
        })
        return res.status(HttpStatus.OK).json({

            message: 'User profile retrieved successfully',
            status: HttpStatus.OK,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }

    async logout(res: Response) {
        try {
            res.clearCookie('access_token')
            res.clearCookie('refresh_token')
            res.send('Logged out successfully')
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            });
        }
    }



    private isValidEmail(email: string): boolean {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRegex.test(email);
    }
}