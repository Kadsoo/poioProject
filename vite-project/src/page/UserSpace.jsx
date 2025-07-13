import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const UserSpace = ({ onBack }) => {
    const [userInfo, setUserInfo] = useState({
        id: 1,
        username: '盲盒爱好者',
        nickname: '盲盒小达人',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        email: 'user@example.com',
        phone: '138****8888',
        joinDate: '2024-01-01',
        totalPurchases: 15,
        totalFavorites: 8
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        nickname: userInfo.nickname,
        password: '',
        confirmPassword: '',
        avatar: userInfo.avatar
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            // 使用API服务获取用户信息
            const data = await userAPI.getUserProfile();
            setUserInfo(data);
            setEditForm(prev => ({
                ...prev,
                nickname: data.nickname,
                avatar: data.avatar
            }));
        } catch (error) {
            console.error('获取用户信息失败:', error);
            // 使用模拟数据作为后备
            setUserInfo({
                id: 1,
                username: '盲盒爱好者',
                nickname: '盲盒小达人',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
                email: 'user@example.com',
                phone: '138****8888',
                joinDate: '2024-01-01',
                totalPurchases: 15,
                totalFavorites: 8
            });
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

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditForm(prev => ({
                    ...prev,
                    avatar: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (editForm.password !== editForm.confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }

        try {
            // 准备更新数据
            const updateData = {
                nickname: editForm.nickname
            };

            // 如果输入了新密码，添加到更新数据中
            if (editForm.password) {
                updateData.password = editForm.password;
            }

            // 使用API服务更新用户信息
            await userAPI.updateUserProfile(updateData);

            // 如果有新头像文件，上传头像
            if (avatarFile) {
                await userAPI.updateAvatar(avatarFile);
            }

            // 更新本地状态
            setUserInfo(prev => ({
                ...prev,
                nickname: editForm.nickname,
                avatar: editForm.avatar
            }));

            alert('保存成功！');
            setIsEditing(false);
            setEditForm({
                nickname: editForm.nickname,
                password: '',
                confirmPassword: '',
                avatar: editForm.avatar
            });
            setAvatarFile(null);
        } catch (error) {
            console.error('保存失败:', error);
            alert('保存失败，请重试');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({
            nickname: userInfo.nickname,
            password: '',
            confirmPassword: '',
            avatar: userInfo.avatar
        });
        setAvatarFile(null);
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
                <div className="max-w-2xl mx-auto">
                    {/* 个人信息卡片 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center space-x-6 mb-6">
                            <div className="relative">
                                <img
                                    src={isEditing ? editForm.avatar : userInfo.avatar}
                                    alt="用户头像"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {isEditing ? editForm.nickname : userInfo.nickname}
                                </h2>
                                <p className="text-gray-600">用户ID: {userInfo.id}</p>
                                <p className="text-gray-600">加入时间: {userInfo.joinDate}</p>
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
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">{userInfo.totalPurchases}</div>
                                <div className="text-sm text-gray-600">购买次数</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600">{userInfo.totalFavorites}</div>
                                <div className="text-sm text-gray-600">收藏数量</div>
                            </div>
                        </div>

                        {/* 编辑表单 */}
                        {isEditing && (
                            <div className="border-t border-gray-200 pt-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            昵称
                                        </label>
                                        <input
                                            type="text"
                                            name="nickname"
                                            value={editForm.nickname}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            新密码
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={editForm.password}
                                            onChange={handleInputChange}
                                            placeholder="留空表示不修改密码"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            确认新密码
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={editForm.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="再次输入新密码"
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

                    {/* 账户信息 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">账户信息</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">用户名</span>
                                <span className="font-medium">{userInfo.username}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">邮箱</span>
                                <span className="font-medium">{userInfo.email}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">手机号</span>
                                <span className="font-medium">{userInfo.phone}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">注册时间</span>
                                <span className="font-medium">{userInfo.joinDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSpace; 