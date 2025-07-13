// API基础配置
const API_BASE_URL = 'http://127.0.0.1:7001/api';

// 通用请求函数
const request = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API请求失败:', error);
        throw error;
    }
};

// 盲盒相关API
export const blindBoxAPI = {
    // 获取盲盒列表
    getBlindBoxes: async () => {
        return request('/blindboxes');
    },

    // 获取单个盲盒详情
    getBlindBox: async (id) => {
        return request(`/blindboxes/${id}`);
    },

    // 创建盲盒
    createBlindBox: async (data) => {
        return request('/blindboxes', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // 更新盲盒
    updateBlindBox: async (id, data) => {
        return request(`/blindboxes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // 删除盲盒
    deleteBlindBox: async (id) => {
        return request(`/blindboxes/${id}`, {
            method: 'DELETE',
        });
    },

    // 点赞盲盒
    likeBlindBox: async (id) => {
        return request(`/blindboxes/${id}/like`, {
            method: 'POST',
        });
    },

    // 取消点赞
    unlikeBlindBox: async (id) => {
        return request(`/blindboxes/${id}/unlike`, {
            method: 'DELETE',
        });
    },

    // 添加评论
    addComment: async (id, comment) => {
        return request(`/blindboxes/${id}/comments`, {
            method: 'POST',
            body: JSON.stringify(comment),
        });
    },

    // 获取评论列表
    getComments: async (id) => {
        return request(`/blindboxes/${id}/comments`);
    },
};

// 用户相关API
export const userAPI = {
    // 用户登录
    login: async (credentials) => {
        return request('/user/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    // 用户注册
    register: async (userData) => {
        return request('/user/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    // 获取用户信息
    getUserProfile: async () => {
        return request('/user/profile');
    },

    // 更新用户信息
    updateUserProfile: async (userData) => {
        return request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },

    // 更新用户头像
    updateAvatar: async (avatarFile) => {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        return request('/user/avatar', {
            method: 'POST',
            headers: {
                // 不设置Content-Type，让浏览器自动设置multipart/form-data
            },
            body: formData,
        });
    },
};

// 订单相关API
export const orderAPI = {
    // 获取用户订单列表
    getUserOrders: async () => {
        return request('/orders');
    },

    // 创建订单
    createOrder: async (orderData) => {
        return request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    // 获取订单详情
    getOrder: async (id) => {
        return request(`/orders/${id}`);
    },

    // 取消订单
    cancelOrder: async (id) => {
        return request(`/orders/${id}/cancel`, {
            method: 'PUT',
        });
    },
};

// 收藏相关API
export const favoriteAPI = {
    // 获取用户收藏列表
    getUserFavorites: async () => {
        return request('/favorites');
    },

    // 添加收藏
    addFavorite: async (blindBoxId) => {
        return request('/favorites', {
            method: 'POST',
            body: JSON.stringify({ blindBoxId }),
        });
    },

    // 取消收藏
    removeFavorite: async (blindBoxId) => {
        return request(`/favorites/${blindBoxId}`, {
            method: 'DELETE',
        });
    },

    // 检查是否已收藏
    checkFavorite: async (blindBoxId) => {
        return request(`/favorites/${blindBoxId}/check`);
    },
};

// 搜索相关API
export const searchAPI = {
    // 搜索盲盒
    searchBlindBoxes: async (query, filters = {}) => {
        const params = new URLSearchParams({
            q: query,
            ...filters,
        });
        return request(`/search/blindboxes?${params}`);
    },

    // 获取热门搜索
    getHotSearches: async () => {
        return request('/search/hot');
    },
};

export default {
    blindBox: blindBoxAPI,
    user: userAPI,
    order: orderAPI,
    favorite: favoriteAPI,
    search: searchAPI,
}; 