import Vue from 'vue';
import axios from 'axios';

const request = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1',
});

request.interceptors.request.use((config) => {
  // 除了登录API以外，都要加上token请求头
  if (!config.url.startsWith('/login')) {
    config.headers.Authorization = localStorage.getItem('token');
  }
  return config;
});

Vue.prototype._plugns = {
  login(data) {
    return request({
      method: 'POST',
      url: '/login',
      data,
    });
  },
  getInfo() {
    return request({
      method: 'GET',
      url: '/menus',
    });
  },
  getUsers(params) {
    return request({
      method: 'GET',
      url: '/users',
      params,
    });
  },
  addUsers(data) {
    return request({
      method: 'POST',
      url: '/users',
      data,
    });
  },
};
