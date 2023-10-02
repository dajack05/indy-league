import api from "./Api";
import { ReturnType, User } from "@ill/common";
import Cookies from "js-cookie";
import { TokenCookie } from "@/Cookie";

function getToken(): TokenCookie | null {
  const _token = Cookies.get('userinfo');
  if (!_token) {
    return null
  }
  return JSON.parse(_token) as TokenCookie;
}

export default {
  async delete(user: User) {
    const token = getToken()?.token;
    if (!token) {
      console.error("No token to submit");
      return;
    }

    const result = await api().delete('user', {
      params: {
        token,
        id: user.id,
      }
    });

    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return;
    }
  },

  async find(id: number): Promise<User | null> {
    const token = getToken();
    if (!token) {
      return null;
    }

    const result = await api().get('user', {
      params: {
        token:token.token,
        id
      }
    });

    const response = result.data as ReturnType;
    if(response.error){
      console.error(response.error);
      return null;
    }

    return response.payload as User;
  },

  async getAll(): Promise<User[]> {
    const token = getToken();
    if (!token) {
      return [];
    }

    const result = await api().get('user', {
      params: {
        token: token.token,
      }
    });
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return [];
    }

    return response.payload;
  },

  async update(user: User): Promise<User> {
    const token = getToken();
    if (!token) {
      return new User();
    }

    const result = await api().put('user', {
      token: token.token,
      class: user.class,
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      password: user.password,
    });
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return user;
    }

    return response.payload;
  }
};
