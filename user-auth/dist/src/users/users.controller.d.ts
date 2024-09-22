import { UsersService } from './users.service';
import { Request, Response } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
