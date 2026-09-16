export type AuthLoginUser = {
    username: string;
    password: string;
}

export type AuthRegisterUser = AuthLoginUser & {
    email: string;
    confirmation: string;
}
