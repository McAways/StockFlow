import axios from "axios";

const proxy = axios.create({
  baseURL: `/api/proxy`
});

const UserService = {
  logon: async (username: string, password: string) => {
    try {
      const res = await proxy.post(
        '',
        { username, password },
        {
          params: {
            url: `http://localhost:8080/api/auth/login`
          },
        }
      );
      return res;
    } catch (error: any) {
      return error.response;
    }
  },

  getAuthenticatedUser: async (token: string) => {
    try {
      const res = await proxy.get('', {
        params: {
          url: `http://localhost:8080/api/auth/me`
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res;
    } catch (error: any) {
      return error.response;
    }
  },
};

export default UserService;
