import api from './Api';

export interface Credentials {
  email: string,
  password: string,
  first_name?: string,
  last_name?: string,
}

export default {
  register(credentials: Credentials) {
    return api().put('register', credentials);
  },
  login(credentials: Credentials) {
    return api().post('login', credentials);
  },
  tokenLogin(email: string, token: string) {
    return api().post('login', { email, token });
  }
};
