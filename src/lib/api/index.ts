import { AuthLoginUser } from "$lib/types/authType"

const BASE_URL = import.meta.env.BASE_URL;
export const getCurrentUser = async () => {
    const response = await fetch(`${BASE_URL}profile`,{
        method: "GET"
    })
    return response;
}

export const loginUser = async (userForm: AuthLoginUser) => {
    const response = await fetch(`${BASE_URL}login`,{
        method: "POST",
        body: JSON.stringify(userForm)
    })
    return response;
}
