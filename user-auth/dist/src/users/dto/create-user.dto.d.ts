export declare class CreateUserDto {
    name: string;
    email: string;
    role: string;
    password: string;
}
export declare class GetUserDto {
    email: string;
    password: string;
}
export declare class User {
    name: string;
    email: string;
    role: string;
}
export declare class UserResponse {
    message: string;
    data: User;
    status: number;
}
