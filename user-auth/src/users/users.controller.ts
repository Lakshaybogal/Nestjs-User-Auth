import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserResponse } from './dto/create-user.dto';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Get('/superadmin')
    async getAllUsers(@Req() req: Request, @Res() res: Response) {
        return await this.usersService.getUsers(req, res);
    }

    @Get('/admin')
    async getUsers(@Req() req: Request, @Res() res: Response) {
        return await this.usersService.getUsers(req, res);
    }

    @Post('/auth/login')
    async getUser(@Req() req: Request, @Res() res: Response) {

        return await this.usersService.getUser(req.body.email, req.body.password, res);
    }

    @Post('/auth/register')
    async createUser(@Req() req: Request, @Res() res: Response) {
        return await this.usersService.createUser(req.body, res);
    }

    @Get('/profile')
    async getProfile(@Req() req: Request, @Res() res: Response) {
        return await this.usersService.getProfile(req, res);
    }

    @Post('/auth/logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        return await this.usersService.logout(res);
    }
    
}
