import { credentialsService } from 'utils/axios';

export const authApi = {
  login: (credentials: { email: string; password: string }) => credentialsService.post('/auth/login', credentials),

  register: (data: { email: string; password: string; firstname: string; lastname: string; username: string; phone: string }) =>
    credentialsService.post('/auth/register', data),

  resetreq: (data: { email: string }) => credentialsService.post('/auth/password/reset-request', data),

  reset: (data: { token: string; password: string }) => credentialsService.post('/auth/password/reset', data),

  change: (data: { oldPassword: string; newPassword: string }) => credentialsService.post('auth/user/password/change', data)
};
