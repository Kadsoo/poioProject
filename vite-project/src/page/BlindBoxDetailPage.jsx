import React, { useState } from 'react';
import { blindBoxAPI } from '../services/api';
import NotificationPage from './NotificationPage';

const BlindBoxDetailPage = ({ blindBox, onBack, onEdit, onDelete, currentUserId }) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [notification, setNotification] = useState(null);
    const [isLiked, setIsLiked] = useState(blindBox.likedUsers?.includes(currentUserId) || false);
    const [likeCount, setLikeCount] = useState(blindBox.likes || 0);
    const [currentBlindBox, setCurrentBlindBox] = useState(blindBox);

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            setNotification({ message: '请输入评论内容', type: 'warning' });
            return;
        }

        if (!currentUserId) {
            setNotification({ message: '请先登录', type: 'error' });
            return;
        }

        try {
            const response = await blindBoxAPI.addComment(currentBlindBox.id, {
                userId: currentUserId,
                content: newComment.trim()
            });

            if (response.success) {
                setNotification({ message: '评论添加成功', type: 'success' });
                setNewComment('');
                // 更新当前盲盒数据以显示新评论
                setCurrentBlindBox(response.data);
            } else {
                setNotification({ message: response.message || '评论添加失败', type: 'error' });
            }
        } catch (error) {
            setNotification({ message: '评论添加失败', type: 'error' });
        }
    };

    const handleLike = async () => {
        if (!currentUserId) {
            setNotification({ message: '请先登录', type: 'error' });
            return;
        }

        try {
            const response = isLiked
                ? await blindBoxAPI.unlikeBlindBox(currentBlindBox.id, currentUserId)
                : await blindBoxAPI.likeBlindBox(currentBlindBox.id, currentUserId);

            if (response.success) {
                setIsLiked(!isLiked);
                setLikeCount(response.data.likes);
                setCurrentBlindBox(response.data);
                setNotification({
                    message: isLiked ? '取消点赞成功' : '点赞成功',
                    type: 'success'
                });
            } else {
                setNotification({ message: response.message, type: 'error' });
            }
        } catch (error) {
            setNotification({ message: '操作失败', type: 'error' });
        }
    };

    const handleShare = () => {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href);
        setNotification({ message: '链接已复制到剪贴板', type: 'success' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {notification && (
                <NotificationPage
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
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
                            <h1 className="text-xl font-bold text-gray-900">盲盒详情</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            {currentUserId && currentBlindBox.userId === currentUserId && (
                                <>
                                    <button
                                        onClick={() => onEdit && onEdit(currentBlindBox)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    >
                                        编辑
                                    </button>
                                    <button
                                        onClick={() => onDelete && onDelete(currentBlindBox.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                        删除
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="max-w-4xl mx-auto">
                    {/* 盲盒图片 */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                        <div className="relative">
                            <img
                                src={currentBlindBox.image}
                                alt={currentBlindBox.title}
                                className="w-full h-96 object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {currentBlindBox.category}
                            </div>
                            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                                ¥{currentBlindBox.price}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 主要内容 */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                {/* 用户信息 */}
                                <div className="flex items-center mb-4">
                                    <img
                                        src={currentBlindBox.user?.avatar || 'https://via.placeholder.com/48x48'}
                                        alt={currentBlindBox.user?.name || '用户'}
                                        className="w-12 h-12 rounded-full mr-3"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {currentBlindBox.user?.name || `用户${currentBlindBox.userId}`}
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            {currentBlindBox.postTime ? new Date(currentBlindBox.postTime).toLocaleString() : '未知时间'}
                                        </div>
                                    </div>
                                </div>

                                {/* 标题和描述 */}
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">{currentBlindBox.title}</h1>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">{currentBlindBox.description}</p>

                                {/* 标签 */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {currentBlindBox.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* 互动按钮 */}
                                <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleLike}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isLiked
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        <span>{likeCount}</span>
                                    </button>
                                    <button
                                        onClick={() => setShowComments(!showComments)}
                                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span>{currentBlindBox.comments?.length || 0}</span>
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                        </svg>
                                        <span>分享</span>
                                    </button>
                                </div>
                            </div>

                            {/* 评论区域 */}
                            {showComments && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">评论</h3>

                                    {/* 添加评论 */}
                                    <div className="mb-6">
                                        <div className="flex space-x-3">
                                            <input
                                                type="text"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="写下你的评论..."
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                onClick={handleAddComment}
                                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                            >
                                                发送
                                            </button>
                                        </div>
                                    </div>

                                    {/* 评论列表 */}
                                    <div className="space-y-4">
                                        {currentBlindBox.comments?.map((comment, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-xs text-gray-600">用户</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="font-medium text-sm">
                                                            用户{comment.userId}
                                                        </span>
                                                        <span className="text-gray-500 text-xs">
                                                            {new Date(comment.time).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 侧边栏 */}
                        <div className="space-y-6">
                            {/* 盲盒信息 */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">盲盒信息</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">系列</span>
                                        <span className="font-medium">{currentBlindBox.series}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">价格</span>
                                        <span className="font-medium text-red-500">¥{currentBlindBox.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">点赞数</span>
                                        <span className="font-medium">{likeCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">评论数</span>
                                        <span className="font-medium">{currentBlindBox.comments?.length || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 物品列表 */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">包含物品</h3>

                                <div className="space-y-3">
                                    {currentBlindBox.items?.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-blue-600 font-semibold">{(item.probability * 100).toFixed(1)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 购买按钮 */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium text-lg">
                                    🛒 立即购买 ¥{currentBlindBox.price}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlindBoxDetailPage; 