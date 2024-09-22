import { JwtTokenService } from './../jwt/jwt.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prsima/prisma.service';
import { Request, Response } from 'express';
export declare class UsersService {
    private readonly prisma;
    private readonly jwtTokenService;
    constructor(prisma: PrismaService, jwtTokenService: JwtTokenService);
    getUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createUser(data: CreateUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getUser(email: string, password: string, res: Response): Promise<Response>;
    getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
    private isValidEmail;
}
