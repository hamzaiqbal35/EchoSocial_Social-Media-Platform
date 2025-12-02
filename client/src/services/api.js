import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
    getProfile: (id) => api.get(`/users/${id}`),
    updateProfile: (data) => api.put('/users/profile', data),
    followUser: (id) => api.post(`/users/${id}/follow`),
    unfollowUser: (id) => api.delete(`/users/${id}/follow`),
    getFollowers: (id) => api.get(`/users/${id}/followers`),
    getFollowing: (id) => api.get(`/users/${id}/following`),
    searchUsers: (query) => api.get(`/users/search?query=${query}`),
    getSuggestedUsers: () => api.get('/users/suggested'),
    blockUser: (id) => api.post(`/users/${id}/block`),
    unblockUser: (id) => api.delete(`/users/${id}/block`),
    createReport: (data) => api.post('/users/report', data),
    changePassword: (data) => api.put('/users/password', data),
    deleteAccount: () => api.delete('/users/account'),
};

// Post API
export const postAPI = {
    getAllPosts: (page = 1, limit = 10) => api.get(`/posts?page=${page}&limit=${limit}`),
    getPost: (id) => api.get(`/posts/${id}`),
    createPost: (data) => api.post('/posts', data, {
        headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    }),
    updatePost: (id, data) => api.put(`/posts/${id}`, data, {
        headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    }),
    deletePost: (id) => api.delete(`/posts/${id}`),
    likePost: (id) => api.post(`/posts/${id}/like`),
    unlikePost: (id) => api.delete(`/posts/${id}/like`),
    getUserPosts: (userId, page = 1, limit = 10) =>
        api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`),
    searchPosts: (query) => api.get(`/posts/search?query=${query}`),
    sharePost: (id, userIds) => api.post(`/posts/${id}/share`, { userIds }),
};

// Comment API
export const commentAPI = {
    getPostComments: (postId) => api.get(`/comments/post/${postId}`),
    createComment: (postId, data) => api.post(`/comments/post/${postId}`, data),
    deleteComment: (id) => api.delete(`/comments/${id}`),
};

// Feed API
export const feedAPI = {
    getFeed: (page = 1, limit = 10) => api.get(`/feed?page=${page}&limit=${limit}`),
};

// Notification API
export const notificationAPI = {
    getNotifications: () => api.get('/notifications'),
    getUnreadCount: () => api.get('/notifications/unread-count'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
};

// Admin API
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getAllUsers: (page = 1, limit = 20, search = '', filter = 'all') =>
        api.get(`/admin/users?page=${page}&limit=${limit}&search=${search}&filter=${filter}`),
    banUser: (id, data) => api.put(`/admin/users/${id}/ban`, data),
    unbanUser: (id) => api.put(`/admin/users/${id}/unban`),
    getAllPosts: (page = 1, limit = 20) => api.get(`/admin/posts?page=${page}&limit=${limit}`),
    deletePost: (id) => api.delete(`/admin/posts/${id}`),
    getReports: (page = 1, limit = 20, status = 'all') =>
        api.get(`/admin/reports?page=${page}&limit=${limit}&status=${status}`),
    resolveReport: (id, status) => api.put(`/admin/reports/${id}/resolve`, { status }),
};

export default api;

