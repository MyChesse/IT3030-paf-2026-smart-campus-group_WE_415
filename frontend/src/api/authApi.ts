import api from './axiosInstance';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name: string;
  profilePictureUrl: string;
}

export const authApi = {
  signup: (data: SignupPayload) => api.post('/api/auth/signup', data),
  login: (data: LoginPayload) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
  updateProfile: (data: UpdateProfilePayload) => api.put('/api/auth/me', data),
  forgotPassword: (data: { email: string }) => api.post('/api/auth/forgot-password', data),
  verifyOtpResetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    api.post('/api/auth/reset-password/verify-otp', data),
};
