import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import NotificationPage from './NotificationPage';

const PurchaseRecordsPage = ({ blindBoxId, onBack }) => {
    const [orders, setOrders] = useState([]);
    const [blindBox, setBlindBox] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchPurchaseRecords();
    }, [blindBoxId]);

    const fetchPurchaseRecords = async () => {
        try {
            setLoading(true);
            console.log('获取购买记录，盲盒ID:', blindBoxId, '用户ID:', user.id);
            const response = await orderAPI.getBlindBoxOwnerOrders(blindBoxId, user.id);
            console.log('购买记录API响应:', response);
            if (response.success) {
                setOrders(response.data.orders);
                setBlindBox(response.data.blindBox);
            } else {
                console.error('API返回错误:', response.message);
                setNotification({ message: response.message, type: 'error' });
            }
        } catch (error) {
            console.error('获取购买记录失败:', error);
            setNotification({ message: '获取购买记录失败', type: 'error' });
        } finally {
            setLoading(false);
        }
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
            'pending': 'bg-yellow-100 text-yellow-800',
            'paid': 'bg-blue-100 text-blue-800',
            'shipped': 'bg-purple-100 text-purple-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">正在加载购买记录...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 通知组件 */}
            {notification && (
                <NotificationPage
                    {...notification}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* 头部 */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">购买记录</h1>
                        </div>
                        <div className="text-sm text-gray-600">
                            共 {orders.length} 条购买记录
                        </div>
                    </div>
                </div>
            </div>

            {/* 盲盒信息 */}
            {blindBox && (
                <div className="container mx-auto px-4 py-6">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center space-x-4">
                            <img
                                src={`${blindBox.image.startsWith('http') ? blindBox.image : `http://127.0.0.1:7001${blindBox.image}`}?t=${Date.now()}`}
                                alt={blindBox.title}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{blindBox.title}</h2>
                                <p className="text-gray-600">¥{blindBox.price}</p>
                            </div>
                        </div>
                    </div>

                    {/* 购买记录列表 */}
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">用户{order.userId}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createTime).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">订单号：</span>
                                        <span className="font-medium">{order.id}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">购买数量：</span>
                                        <span className="font-medium">{order.quantity}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">总价：</span>
                                        <span className="font-medium text-red-500">¥{order.totalPrice}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">抽奖结果：</span>
                                        <span className="font-medium">
                                            {order.items?.map(item => item.name).join(', ') || '暂无'}
                                        </span>
                                    </div>
                                </div>

                                {/* 抽奖结果详情 */}
                                {order.items && order.items.length > 0 && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium text-gray-900 mb-2">抽奖结果详情：</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                    <span className="text-sm">{item.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 空状态 */}
                    {orders.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">暂无购买记录</h3>
                            <p className="mt-1 text-sm text-gray-500">还没有人购买这个盲盒</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PurchaseRecordsPage; 