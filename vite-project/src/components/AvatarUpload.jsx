import React, { useState } from 'react';
import { uploadAPI, userAPI } from '../services/api';
import NotificationPage from '../page/NotificationPage';

const AvatarUpload = ({ userId, currentAvatar, onAvatarUpdate }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 验证文件类型
            if (!file.type.startsWith('image/')) {
                setNotification({ message: '请选择图片文件', type: 'error' });
                return;
            }

            // 验证文件大小（5MB）
            if (file.size > 5 * 1024 * 1024) {
                setNotification({ message: '图片大小不能超过5MB', type: 'error' });
                return;
            }

            setSelectedFile(file);

            // 创建预览
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setNotification({ message: '请先选择图片', type: 'warning' });
            return;
        }

        try {
            setUploading(true);

            // 上传图片
            const imageUrl = await uploadAPI.uploadImage(selectedFile);
            console.log('上传返回的URL:', imageUrl);

            // 更新用户头像
            const response = await userAPI.updateAvatar(userId, imageUrl);
            console.log('更新头像响应:', response);

            if (response.success) {
                setNotification({ message: '头像更新成功', type: 'success' });
                onAvatarUpdate(response.data);
                setSelectedFile(null);
                setImagePreview(null);
            } else {
                setNotification({ message: '头像更新失败: ' + response.message, type: 'error' });
            }
        } catch (error) {
            console.error('头像上传失败:', error);
            setNotification({ message: '头像上传失败: ' + error.message, type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        setImagePreview(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* 通知组件 */}
            {notification && (
                <NotificationPage
                    {...notification}
                    onClose={() => setNotification(null)}
                />
            )}

            <h3 className="text-lg font-semibold text-gray-900 mb-4">更新头像</h3>

            {/* 当前头像 */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    当前头像
                </label>
                <div className="flex items-center space-x-4">
                    <img
                        src={currentAvatar || "/avatar.jpg"}
                        alt="当前头像"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <span className="text-sm text-gray-600">
                        当前使用的头像
                    </span>
                </div>
            </div>

            {/* 文件选择 */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择新头像
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                    支持 JPG、PNG、GIF 格式，文件大小不超过 5MB
                </p>
            </div>

            {/* 图片预览 */}
            {imagePreview && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        预览
                    </label>
                    <div className="relative inline-block">
                        <img
                            src={imagePreview}
                            alt="预览"
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                        <button
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* 操作按钮 */}
            <div className="flex space-x-3">
                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                    {uploading ? '上传中...' : '上传头像'}
                </button>
                {imagePreview && (
                    <button
                        onClick={handleRemove}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                        取消
                    </button>
                )}
            </div>
        </div>
    );
};

export default AvatarUpload; 