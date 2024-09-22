
export class CreateUserDto {
    name: string;
    email: string;
    role: string;
    password: string;
}

export class GetUserDto {
    email: string;
    password: string;
}

export class User {
    name: string;
    email: string;
    role: string;
}

export class UserResponse {
    message: string;
    data: User;
    status: number;

}