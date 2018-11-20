import qs from 'qs';
import axios from 'axios';
import devConfig from '../settings.js';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';

const axiosInstance = axios.create({
  baseURL: devConfig.domain ? `${devConfig.domain}/api/v1/` : '/api/',
  timeout: 10000,
  paramsSerializer: (params) => (
    qs.stringify(params, { arrayFormat: 'repeat' })
  ),
});

class Resource {
  constructor(resourceUrl) {
    this.config = {};
    this.resourceUrl = resourceUrl;
  }

  at(url) {
    const newResourceUrl = `${this.resourceUrl}${url}`;
    return new Resource(newResourceUrl);
  }

  get(params) {
    if (params) this.config.params = params;
    this.config.method = 'GET';
    return this.request();
  }

  post(data) {
    if (data) this.config.data = data;
    this.config.method = 'POST';
    return this.request();
  }

  put(data) {
    if (data) this.config.data = data;
    this.config.method = 'put';
    return this.request();
  }

  patch(data) {
    if (data) this.config.data = data;
    this.config.method = 'patch';
    return this.request();
  }

  delete(url) {
    this.config.method = 'delete';
    return this.request(url);
  };

  request(url='') {
    this.config.url = `${this.resourceUrl}${url}`;
    return axiosInstance.request(this.config)
      .then((response) => {
        this.config = {};
        return response;
      })
      .catch((error) => {
        this.config = {};
        throw error;
      });
  }
}

export const ResourceSignup = new Resource('accounts/user/');
export const ResourceSignin = new Resource('token-auth/');
export const ResourceUser = new Resource('user/'+localStorage.getItem("id"));
export const ResourceCountry = new Resource('country/'+localStorage.getItem("id"));
export const ResourcePasswordRestart = new Resource(`accounts/user/${localStorage.getItem("id")}/set_password/`);
export const ResourceGetEmails = new Resource('accounts/user/');
export const ResourceGetPhones = new Resource('accounts/user/');
export const ResourceEmail = new Resource('accounts/user-emails/');
export const ResourcePhone = new Resource('accounts/user-phones/');