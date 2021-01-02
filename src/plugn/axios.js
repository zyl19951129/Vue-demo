import Vue from 'vue';
import axios from 'axios';
import router from '../router/index.js';

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

request.interceptors.response.use((res) => {
  if (res.data.meta.status === 400) {
    localStorage.removeItem('token');
    router.push('/login');
  }
  return res;
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
  delUsers(id) {
    return request({
      method: 'DELETE',
      url: `/users/${id}`,
    });
  },
  editUsers(data) {
    return request({
      method: 'PUT',
      url: `/users/${data.id}`,
      data: {
        email: data.email,
        mobile: data.mobile,
      },
    });
  },
  editState(uid, state) {
    return request({
      method: 'PUT',
      url: `/users/${uid}/state/${state}`,
    });
  },
  getRightsInfo(type) {
    return request({
      method: 'GET',
      url: `rights/${type}`,
    });
  },
  getRolesInfo() {
    return request({
      method: 'GET',
      url: 'roles',
    });
  },
  delRolesOfAppoint(roleId, rightId) {
    return request({
      method: 'DELETE',
      url: `roles/${roleId.id}/rights/${rightId}`,
    });
  },
  addNewRoles(roleName, roleDesc) {
    return request({
      method: 'POST',
      url: 'roles',
      data: {
        roleName,
        roleDesc,
      },
    });
  },
  addRolesOfAppoint(data, roleId) {
    return request({
      method: 'POST',
      url: `roles/${roleId}/rights`,
      data: {
        rids: data,
      },
    });
  },
};
