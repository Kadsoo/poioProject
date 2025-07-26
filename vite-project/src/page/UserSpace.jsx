import React, { useState, useEffect } from 'react';
import { userAPI, orderAPI } from '../services/api';
import NotificationPage from './NotificationPage';

const UserSpace = ({ onBack }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user?.id) {
            fetchUserData();
        }
    }, [user?.id]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const [userInfoRes, userStatsRes, ordersRes] = await Promise.all([
                userAPI.getUserInfo(user.id),
                userAPI.getUserStats(user.id),
                orderAPI.getUserOrders(user.id)
            ]);

            if (userInfoRes.success) {
                setUserInfo(userInfoRes.data);
                setEditForm({
                    username: userInfoRes.data.username,
                    mail: userInfoRes.data.mail || '',
                    phone: userInfoRes.data.phone || ''
                });
            }
            if (userStatsRes.success) {
                setUserStats(userStatsRes.data);
            }
            if (ordersRes.success) {
                setOrders(ordersRes.data);
            }
        } catch (error) {
            console.error('获取用户数据失败:', error);
            setNotification({ message: '获取用户数据失败', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            await userAPI.updateUserInfo(user.id, editForm);
            setUserInfo(prev => ({ ...prev, ...editForm }));
            setIsEditing(false);
            setNotification({ message: '保存成功', type: 'success' });
        } catch (error) {
            setNotification({ message: '保存失败', type: 'error' });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({
            username: userInfo?.username || '',
            mail: userInfo?.mail || '',
            phone: userInfo?.phone || ''
        });
    };

    const getStatusText = (status) => {
        const statusMap = {
            'pending': '待付款',
            'paid': '已付款',
            'shipped': '已发货',
            'delivered': '已送达',
            'cancelled': '已取消'
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status) => {
        const colorMap = {
            'pending': 'text-yellow-600 bg-yellow-100',
            'paid': 'text-blue-600 bg-blue-100',
            'shipped': 'text-purple-600 bg-purple-100',
            'delivered': 'text-green-600 bg-green-100',
            'cancelled': 'text-red-600 bg-red-100'
        };
        return colorMap[status] || 'text-gray-600 bg-gray-100';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">正在加载用户信息...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {notification && (
                <NotificationPage
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* 顶部导航栏 */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">我的空间</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* 主要内容区域 */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-4xl mx-auto">
                    {/* 个人信息卡片 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center space-x-6 mb-6">
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
                                    alt="用户头像"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {userInfo?.username || '用户'}
                                </h2>
                                <p className="text-gray-600">用户ID: {userInfo?.id}</p>
                                <p className="text-gray-600">注册时间: {userInfo?.registerDate}</p>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    编辑资料
                                </button>
                            )}
                        </div>

                        {/* 统计信息 */}
                        {userStats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {userStats.totalStats?.totalBlindBoxes || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">发布盲盒</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {userStats.totalStats?.totalOrders || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">订单数量</div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {userStats.totalStats?.totalLikes || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">获得点赞</div>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-red-600">
                                        ¥{userStats.totalStats?.totalAmount || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">消费总额</div>
                                </div>
                            </div>
                        )}

                        {/* 编辑表单 */}
                        {isEditing && (
                            <div className="border-t border-gray-200 pt-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            用户名
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={editForm.username || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            邮箱
                                        </label>
                                        <input
                                            type="email"
                                            name="mail"
                                            value={editForm.mail || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            手机号
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={editForm.phone || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        保存
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        取消
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 订单列表 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">我的订单</h3>
                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-medium text-gray-900">订单 #{order.id}</h4>
                                                <p className="text-sm text-gray-600">
                                                    创建时间: {new Date(order.createTime).toLocaleString()}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">盲盒ID:</span>
                                                <span className="ml-2 font-medium">{order.blindBoxId}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">数量:</span>
                                                <span className="ml-2 font-medium">{order.quantity}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">总价:</span>
                                                <span className="ml-2 font-medium text-red-600">¥{order.totalPrice}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">联系人:</span>
                                                <span className="ml-2 font-medium">{order.contactName || '未填写'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">暂无订单</h3>
                                <p className="mt-1 text-sm text-gray-500">您还没有购买过盲盒</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSpace; 