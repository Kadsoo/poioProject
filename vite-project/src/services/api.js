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
    // 获取全部盲盒
    getAllBlindBoxes: () => request('/blindboxes'),

    // 获取单个盲盒
    getBlindBox: (id) => request(`/blindboxes/${id}`),

    // 创建盲盒
    createBlindBox: (data) => request('/blindboxes', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // 更新盲盒
    updateBlindBox: (id, data) => request(`/blindboxes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    // 删除盲盒
    deleteBlindBox: (id) => request(`/blindboxes/${id}`, {
        method: 'DELETE'
    }),

    // 点赞盲盒
    likeBlindBox: (id) => request(`/blindboxes/${id}/like`, {
        method: 'POST'
    }),

    // 取消点赞
    unlikeBlindBox: (id) => request(`/blindboxes/${id}/unlike`, {
        method: 'DELETE'
    }),

    // 添加评论
    addComment: (id, comment) => request(`/blindboxes/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify(comment)
    }),

    // 获取评论
    getComments: (id) => request(`/blindboxes/${id}/comments`),

    // 搜索盲盒
    searchBlindBoxes: (keyword) => request(`/blindboxes/search?q=${encodeURIComponent(keyword)}`),

    // 获取用户的盲盒列表
    getUserBlindBoxes: (userId) => request(`/blindboxes/user/${userId}`),

    // 初始化示例数据
    initData: () => request('/blindboxes/init', {
        method: 'POST'
    }),

    // 文件上传
    uploadImage: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    // 提取 Base64 数据（去掉 data:image/...;base64, 前缀）
                    const base64 = e.target.result.split(',')[1];

                    const response = await fetch('/api/blindboxes/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            image: base64,
                            filename: file.name
                        })
                    });

                    const result = await response.json();
                    if (result.success) {
                        resolve(result.url);
                    } else {
                        reject(new Error(result.message));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsDataURL(file);
        });
    }
};

// 订单相关API
export const orderAPI = {
    // 获取用户订单列表
    getUserOrders: (userId) => request(`/orders/user/${userId}`),

    // 创建订单
    createOrder: (data) => request('/orders', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // 获取订单详情
    getOrder: (id) => request(`/orders/${id}`),

    // 更新订单状态
    updateOrderStatus: (id, status) => request(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),

    // 删除订单
    deleteOrder: (id) => request(`/orders/${id}`, {
        method: 'DELETE'
    })
};

// 用户相关API
export const userAPI = {
    // 用户登录
    login: (data) => request('/user/login', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // 用户注册
    register: (data) => request('/user/register', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // 获取用户信息
    getUserInfo: (userId) => request(`/user/${userId}`),

    // 更新用户信息
    updateUserInfo: (userId, data) => request(`/user/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    // 获取用户统计数据
    getUserStats: (userId) => request(`/user/${userId}/stats`)
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