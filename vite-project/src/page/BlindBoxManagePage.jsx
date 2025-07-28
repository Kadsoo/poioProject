import React, { useState, useEffect } from 'react';
import { blindBoxAPI } from '../services/api';
import NotificationPage from './NotificationPage';
import BlindBoxCreatePage from './BlindBoxCreatePage';
import PurchaseRecordsPage from './PurchaseRecordsPage';

const BlindBoxManagePage = ({ onBack, currentUserId }) => {
    const [myBlindBoxes, setMyBlindBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [editingBlindBox, setEditingBlindBox] = useState(null);
    const [showCreatePage, setShowCreatePage] = useState(false);
    const [selectedBlindBox, setSelectedBlindBox] = useState(null);
    const [showPurchaseRecords, setShowPurchaseRecords] = useState(false);

    // 获取我的盲盒列表
    useEffect(() => {
        fetchMyBlindBoxes();
    }, []);

    const fetchMyBlindBoxes = async () => {
        try {
            setLoading(true);
            console.log('当前用户ID:', currentUserId);
            const response = await blindBoxAPI.getUserBlindBoxes(currentUserId);
            console.log('API响应:', response);

            // 检查响应格式并提取数据
            if (response.success && response.data) {
                setMyBlindBoxes(response.data);
            } else if (Array.isArray(response)) {
                // 如果直接返回数组
                setMyBlindBoxes(response);
            } else {
                console.error('API返回格式错误:', response);
                setMyBlindBoxes([]);
            }
        } catch (error) {
            console.error('获取盲盒列表失败:', error);
            setNotification({ message: '获取盲盒列表失败', type: 'error' });
            setMyBlindBoxes([]);
        } finally {
            setLoading(false);
        }
    };

    // 删除盲盒
    const handleDeleteBlindBox = async (blindBoxId) => {
        setNotification({
            message: '确定要删除这个盲盒吗？',
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await blindBoxAPI.deleteBlindBox(blindBoxId);
                    fetchMyBlindBoxes();
                    setNotification({ message: '删除成功', type: 'success' });
                } catch (error) {
                    setNotification({ message: '删除失败', type: 'error' });
                }
            },
            onCancel: () => setNotification(null)
        });
    };

    // 查看购买记录
    const handleViewPurchaseRecords = (blindBox) => {
        setSelectedBlindBox(blindBox);
        setShowPurchaseRecords(true);
    };

    // 如果显示购买记录页面
    if (showPurchaseRecords && selectedBlindBox) {
        return (
            <PurchaseRecordsPage
                blindBoxId={selectedBlindBox.id}
                onBack={() => {
                    setShowPurchaseRecords(false);
                    setSelectedBlindBox(null);
                }}
            />
        );
    }

    const handleEditBlindBox = (blindBox) => {
        setEditingBlindBox(blindBox);
        setShowCreatePage(true);
    };

    const handleUpdateSuccess = () => {
        setShowCreatePage(false);
        setEditingBlindBox(null);
        fetchMyBlindBoxes();
        setNotification({ message: '更新成功', type: 'success' });
    };

    if (showCreatePage) {
        return (
            <BlindBoxCreatePage
                onBack={() => {
                    setShowCreatePage(false);
                    setEditingBlindBox(null);
                }}
                onSuccess={handleUpdateSuccess}
                editingBlindBox={editingBlindBox}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {notification && (
                <NotificationPage
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                    onConfirm={notification.onConfirm}
                    onCancel={notification.onCancel}
                />
            )}

            {/* 顶部导航 */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
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
                            <h1 className="text-xl font-bold text-gray-900">我的盲盒</h1>
                        </div>
                        <button
                            onClick={() => setShowCreatePage(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            发布新盲盒
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* 统计信息 */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {Array.isArray(myBlindBoxes) ? myBlindBoxes.length : 0}
                                </div>
                                <div className="text-gray-600 text-sm">总盲盒数</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {Array.isArray(myBlindBoxes) ? myBlindBoxes.reduce((sum, box) => sum + (box.likes || 0), 0) : 0}
                                </div>
                                <div className="text-gray-600 text-sm">总点赞数</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {Array.isArray(myBlindBoxes) ? myBlindBoxes.reduce((sum, box) => sum + (box.comments?.length || 0), 0) : 0}
                                </div>
                                <div className="text-gray-600 text-sm">总评论数</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    ¥{Array.isArray(myBlindBoxes) ? myBlindBoxes.reduce((sum, box) => sum + (box.price || 0), 0) : 0}
                                </div>
                                <div className="text-gray-600 text-sm">总价值</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 加载状态 */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-600">正在加载您的盲盒...</p>
                    </div>
                )}

                {/* 盲盒列表 */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(myBlindBoxes) && myBlindBoxes.map(blindBox => (
                            <div key={blindBox.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                {/* 盲盒图片 */}
                                <div className="relative">
                                    <img
                                        src={`${blindBox.image.startsWith('http') ? blindBox.image : `http://127.0.0.1:7001${blindBox.image}`}?t=${Date.now()}`}
                                        alt={blindBox.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                        {blindBox.category}
                                    </div>
                                    <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                        ¥{blindBox.price}
                                    </div>
                                </div>

                                {/* 内容区域 */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                                        {blindBox.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                        {blindBox.description}
                                    </p>

                                    {/* 统计信息 */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                        <span>点赞 {blindBox.likes || 0}</span>
                                        <span>评论 {blindBox.comments?.length || 0}</span>
                                        <span>{blindBox.postTime}</span>
                                    </div>

                                    {/* 操作按钮 */}
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditBlindBox(blindBox)}
                                            className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition text-sm"
                                        >
                                            编辑
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBlindBox(blindBox.id)}
                                            className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition text-sm"
                                        >
                                            删除
                                        </button>
                                        <button
                                            onClick={() => handleViewPurchaseRecords(blindBox)}
                                            className="flex-1 bg-purple-500 text-white py-2 px-3 rounded-lg hover:bg-purple-600 transition text-sm"
                                        >
                                            购买记录
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 空状态 */}
                {!loading && (!Array.isArray(myBlindBoxes) || myBlindBoxes.length === 0) && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">还没有发布过盲盒</h3>
                        <p className="mt-1 text-sm text-gray-500">开始发布您的第一个盲盒吧！</p>
                        <div className="mt-6">
                            <button
                                onClick={() => setShowCreatePage(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                            >
                                发布第一个盲盒
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlindBoxManagePage; 