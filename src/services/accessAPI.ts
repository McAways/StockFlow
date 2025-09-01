import axios from "axios"

const proxy = axios.create({
    baseURL: `/api/proxy`
})

const UserService = {
    logon: async (email: string, password: string) => {
        try {
            const res = await proxy.post('', { "email": email, "password": password }, {
                params: {
                    url: `http://localhost:8080/api/v1/auth/login`
                },
            })
            return res
        }
        catch (error: any) {
            return error.response
        }
    },


    getAuthenticatedUser: async (bearerToken: string) => {
        try {
            const res = await proxy.get('', {
                params: {
                    url: `http://localhost:8080/api/v1/users/authenticatedUser`
                },
                headers: {
                    Authorization: bearerToken
                }
            })
            return res
        }
        catch (error: any) {
            return error.response
        }
    },

}

export default UserService