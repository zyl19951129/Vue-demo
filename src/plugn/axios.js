import Vue from 'vue';
import axios from 'axios';
import router from '../router/index.js';
import { Loading } from 'element-ui';

const request = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1',
});

let loadingInstance = null;

request.interceptors.request.use((config) => {
  loadingInstance = Loading.service({ fullscreen: true });
  // 除了登录API以外，都要加上token请求头
  if (!config.url.startsWith('/login')) {
    config.headers.Authorization = localStorage.getItem('token');
  }
  return config;
});

request.interceptors.response.use((res) => {
  Vue.nextTick(() => {
    loadingInstance.close();
  });
  if (res.data.meta.status === 400 && res.data.meta.msg === '无效的token') {
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
  // 用户管理模块
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
  // 权限管理模块
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
  // 商品管理模块
  getGoodsInfo(data) {
    return request({
      method: 'GET',
      url: '/categories',
      params: data,
    });
  },
  getChildrenListByPid(pid) {
    return request({
      method: 'GET',
      url: `categories/pid/${pid}`,
    });
  },
  addGoodsInfo(data) {
    return request({
      method: 'POST',
      url: '/categories',
      data: data,
    });
  },
  delGoodsCate(id) {
    return request({
      method: 'DELETE',
      url: `/categories/${id}`,
    });
  },
};
