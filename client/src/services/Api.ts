import axios from 'axios';

const server_url = process.env.NODE_ENV === 'development' ? null : process.env.VUE_APP_SERVER_URL;

export default () => {
  return axios.create({
    baseURL: server_url || `http://localhost:8081/`,
  });
};
