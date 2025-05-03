export interface user {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    type : string
}
export interface login {
    id: number;
    email: string;
    password: string;
}