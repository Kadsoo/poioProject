import React, { useState, useEffect } from 'react';
import NotificationPage from './NotificationPage';
import { playerShowAPI } from '../services/api';

const PlayerShowPage = ({ onBack }) => {
    const [playerShows, setPlayerShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const [notification, setNotification] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    // 获取玩家秀数据
    useEffect(() => {
        fetchPlayerShows();
    }, []);

    const fetchPlayerShows = async (pageNum = 1, append = false) => {
        try {
            if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            
            const response = await playerShowAPI.getPlayerShows(pageNum);
            
            if (response.success) {
                const { data, pagination } = response;
                
                if (append) {
                    setPlayerShows(prev => [...prev, ...data]);
                } else {
                    setPlayerShows(data);
                }
                
                setPage(pagination.page);
                setHasMore(pagination.hasMore);
                setTotal(pagination.total);
            } else {
                setNotification({
                    type: 'error',
                    message: '获取玩家秀数据失败: ' + response.message
                });
            }
        } catch (error) {
            console.error('获取玩家秀数据失败:', error);
            setNotification({
                type: 'error',
                message: '网络错误，无法获取玩家秀数据'
            });
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // 加载更多
    const handleLoadMore = async () => {
        if (hasMore && !loadingMore) {
            await fetchPlayerShows(page + 1, true);
        }
    };

    // 点赞
    const handleLike = async (playerShow) => {
        if (!user) {
            setNotification({
                type: 'error',
                message: '请先登录'
            });
            return;
        }

        try {
            const isLiked = playerShow.likedUsers?.includes(user.id);
            const response = isLiked 
                ? await playerShowAPI.unlikePlayerShow(playerShow.id, user.id)
                : await playerShowAPI.likePlayerShow(playerShow.id, user.id);

            if (response.success) {
                // 更新本地状态
                setPlayerShows(prev => prev.map(show => 
                    show.id === playerShow.id 
                        ? { ...show, ...response.data }
                        : show
                ));
                setNotification({
                    type: 'success',
                    message: isLiked ? '取消点赞成功' : '点赞成功'
                });
            } else {
                setNotification({
                    type: 'error',
                    message: response.message
                });
            }
        } catch (error) {
            setNotification({
                type: 'error',
                message: '操作失败'
            });
        }
    };

    // 添加评论
    const handleAddComment = async (playerShowId, content) => {
        if (!user) {
            setNotification({
                type: 'error',
                message: '请先登录'
            });
            return;
        }

        try {
            const response = await playerShowAPI.addComment(playerShowId, {
                userId: user.id,
                content
            });

            if (response.success) {
                // 更新本地状态
                setPlayerShows(prev => prev.map(show => 
                    show.id === playerShowId 
                        ? { ...show, comments: response.data.comments }
                        : show
                ));
                setNotification({
                    type: 'success',
                    message: '评论成功'
                });
            } else {
                setNotification({
                    type: 'error',
                    message: response.message
                });
            }
        } catch (error) {
            setNotification({
                type: 'error',
                message: '评论失败'
            });
        }
    };

    // 初始化示例数据
    const initSampleData = async () => {
        try {
            setLoading(true);
            const response = await playerShowAPI.initData();
            if (response.success) {
                setNotification({
                    type: 'success',
                    message: response.message
                });
                await fetchPlayerShows(1, false);
            } else {
                setNotification({
                    type: 'error',
                    message: '初始化数据失败: ' + response.message
                });
            }
        } catch (error) {
            setNotification({
                type: 'error',
                message: '初始化数据失败'
            });
        } finally {
            setLoading(false);
        }
    };

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
                            <h1 className="text-2xl font-bold text-gray-900">玩家秀</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                                共 {total} 个玩家秀
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 主要内容 */}
            <div className="container mx-auto px-4 py-6">
                {/* 加载状态 */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-600">正在加载玩家秀数据...</p>
                    </div>
                )}

                {/* 玩家秀列表 */}
                {!loading && (
                    <div className="space-y-6">
                        {playerShows.map(playerShow => (
                            <PlayerShowCard
                                key={playerShow.id}
                                playerShow={playerShow}
                                currentUserId={user?.id}
                                onLike={handleLike}
                                onAddComment={handleAddComment}
                            />
                        ))}
                    </div>
                )}

                {/* 加载更多 */}
                {!loading && playerShows.length > 0 && hasMore && (
                    <div className="text-center mt-8">
                        <button 
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loadingMore ? (
                                <>
                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    加载中...
                                </>
                            ) : (
                                `加载更多 (${playerShows.length}/${total})`
                            )}
                        </button>
                    </div>
                )}

                {/* 空状态 */}
                {!loading && playerShows.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">还没有玩家秀</h3>
                        <p className="mt-1 text-sm text-gray-500">购买盲盒后可以发表玩家秀</p>
                        <button 
                            onClick={initSampleData}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            初始化示例数据
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// 玩家秀卡片组件
const PlayerShowCard = ({ playerShow, currentUserId, onLike, onAddComment }) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const isLiked = playerShow.likedUsers?.includes(currentUserId);

    const handleSubmitComment = () => {
        if (newComment.trim()) {
            onAddComment(playerShow.id, newComment.trim());
            setNewComment('');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 头部 */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <img
                        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                        alt="用户头像"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900">玩家秀达人</h3>
                        <p className="text-sm text-gray-500">
                            {new Date(playerShow.createTime).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* 内容 */}
            <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {playerShow.title}
                </h4>
                <p className="text-gray-700 mb-4">
                    {playerShow.content}
                </p>

                {/* 图片 */}
                {playerShow.images && playerShow.images.length > 0 && (
                    <div className="mb-4">
                        <img
                            src={playerShow.images[0]}
                            alt="玩家秀图片"
                            className="w-full h-64 object-cover rounded-lg"
                        />
                    </div>
                )}

                {/* 操作按钮 */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => onLike(playerShow)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                            isLiked 
                                ? 'bg-red-100 text-red-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{playerShow.likes || 0}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{playerShow.comments?.length || 0}</span>
                    </button>
                </div>

                {/* 评论区域 */}
                {showComments && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                        {/* 添加评论 */}
                        <div className="flex space-x-2 mb-4">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="写下你的评论..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                            />
                            <button
                                onClick={handleSubmitComment}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                发送
                            </button>
                        </div>

                        {/* 评论列表 */}
                        {playerShow.comments && playerShow.comments.length > 0 && (
                            <div className="space-y-2">
                                {playerShow.comments.map((comment, index) => (
                                    <div key={index} className="flex space-x-2">
                                        <img
                                            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face"
                                            alt="用户头像"
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="bg-gray-100 rounded-lg px-3 py-2">
                                                <p className="text-sm text-gray-900">{comment.content}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(comment.time).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerShowPage; 