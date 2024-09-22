import axios from "axios";
const baseURL = 'http://localhost:3000';

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(
            `${baseURL}/users/auth/login`,
            {
                "email": email,
                "password": password
            },
            {
                withCredentials: true
            }
        );
        return response;
    }
    catch (err) {
        console.log(err)
        return err
    }
};

export const register = async (name: string, email: string, role: string, password: string) => {
    try {
        const response = await axios.post(
            `${baseURL}/users/auth/register`,
            {
                "email": email,
                "password": password,
                'name': name,
                'role': role
            },
            {
                withCredentials: true
            }
        );
        return response;
    }
    catch (err) {
        console.error(err)
        return err
    }
};
