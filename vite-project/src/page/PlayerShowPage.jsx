import React, { useState, useEffect, useRef } from 'react';
import { playerShowAPI, uploadAPI } from '../services/api';
import NotificationPage from './NotificationPage';
import { orderAPI } from '../services/api';

const PlayerShowPage = ({ onBack }) => {
    const [playerShows, setPlayerShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const [notification, setNotification] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createForm, setCreateForm] = useState({
        title: '',
        content: '',
        blindBoxId: ''
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [imagePreview, setImagePreview] = useState([]);
    const [userOrders, setUserOrders] = useState([]);

    // 获取玩家秀数据
    useEffect(() => {
        fetchPlayerShows();
        if (user) {
            fetchUserOrders();
        }
    }, []);

    const fetchPlayerShows = async (pageNum = 1, append = false) => {
        try {
            if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            console.log('获取玩家秀数据，页码:', pageNum);
            const response = await playerShowAPI.getPlayerShows(pageNum);
            console.log('玩家秀API响应:', response);

            if (response.success) {
                const { data, pagination } = response;
                console.log('玩家秀数据:', data);
                console.log('分页信息:', pagination);

                if (append) {
                    setPlayerShows(prev => [...prev, ...data]);
                } else {
                    setPlayerShows(data);
                }

                setPage(pagination.page);
                setHasMore(pagination.hasMore);
                setTotal(pagination.total);
            } else {
                console.error('API返回错误:', response.message);
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

    // 获取用户订单
    const fetchUserOrders = async () => {
        try {
            const response = await orderAPI.getUserOrders(user.id);
            if (response.success) {
                setUserOrders(response.data);
            }
        } catch (error) {
            console.error('获取用户订单失败:', error);
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

    // 编辑玩家秀
    const handleEditPlayerShow = async (playerShowId, updatedData) => {
        if (!user) {
            setNotification({
                type: 'error',
                message: '请先登录'
            });
            return;
        }

        try {
            const response = await playerShowAPI.updatePlayerShow(playerShowId, {
                ...updatedData,
                userId: user.id
            });

            if (response.success) {
                // 更新本地状态
                setPlayerShows(prev => prev.map(show =>
                    show.id === playerShowId
                        ? { ...show, ...response.data }
                        : show
                ));
                setNotification({
                    type: 'success',
                    message: '编辑成功'
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
                message: '编辑失败'
            });
        }
    };

    // 删除玩家秀
    const handleDeletePlayerShow = async (playerShowId) => {
        if (!user) {
            setNotification({
                type: 'error',
                message: '请先登录'
            });
            return;
        }

        try {
            const response = await playerShowAPI.deletePlayerShow(playerShowId, user.id);

            if (response.success) {
                // 从本地状态中移除
                setPlayerShows(prev => prev.filter(show => show.id !== playerShowId));
                setNotification({
                    type: 'success',
                    message: '删除成功'
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
                message: '删除失败'
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

    const handleImageUpload = async (files) => {
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        const uploadedUrls = [];

        try {
            for (let file of files) {
                const imageUrl = await uploadAPI.uploadImage(file);
                uploadedUrls.push(imageUrl);
            }
            setNotification({ message: '图片上传成功', type: 'success' });
            return uploadedUrls;
        } catch (error) {
            setNotification({ message: '图片上传失败: ' + error.message, type: 'error' });
            return [];
        } finally {
            setUploadingImages(false);
        }
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);

        // 创建预览
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
    };

    const handleCreatePlayerShow = async () => {
        if (!createForm.title || !createForm.content || !createForm.blindBoxId) {
            setNotification({ message: '请填写完整信息', type: 'warning' });
            return;
        }

        try {
            // 先上传图片
            let imageUrls = [];
            if (selectedImages.length > 0) {
                imageUrls = await handleImageUpload(selectedImages);
            }

            const playerShowData = {
                title: createForm.title,
                content: createForm.content,
                blindBoxId: parseInt(createForm.blindBoxId),
                userId: user.id,
                images: imageUrls
            };

            console.log('创建玩家秀数据:', playerShowData);
            const response = await playerShowAPI.createPlayerShow(playerShowData);
            console.log('创建玩家秀响应:', response);

            setNotification({ message: '玩家秀发布成功', type: 'success' });
            setShowCreateForm(false);
            setCreateForm({ title: '', content: '', blindBoxId: '' });
            setSelectedImages([]);
            setImagePreview([]);
            fetchPlayerShows();
        } catch (error) {
            console.error('创建玩家秀失败:', error);
            setNotification({ message: '发布失败: ' + error.message, type: 'error' });
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
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                发布玩家秀
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 主要内容 */}
            <div className="container mx-auto px-4 py-6">
                {/* 创建玩家秀表单 */}
                {showCreateForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">发布玩家秀</h3>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    标题
                                </label>
                                <input
                                    type="text"
                                    value={createForm.title}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-2 border rounded"
                                    placeholder="玩家秀标题"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    内容
                                </label>
                                <textarea
                                    value={createForm.content}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, content: e.target.value }))}
                                    className="w-full p-2 border rounded"
                                    rows="4"
                                    placeholder="分享你的开箱体验..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    选择盲盒
                                </label>
                                <select
                                    value={createForm.blindBoxId}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, blindBoxId: e.target.value }))}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">选择盲盒</option>
                                    {userOrders.map(order => (
                                        <option key={order.id} value={order.blindBoxId}>
                                            {order.blindBoxTitle} - 订单#{order.id}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    图片（可选）
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="w-full p-2 border rounded"
                                />
                                {imagePreview.length > 0 && (
                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        {imagePreview.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={preview}
                                                    alt="预览"
                                                    className="w-full h-24 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newFiles = selectedImages.filter((_, i) => i !== index);
                                                        const newPreviews = imagePreview.filter((_, i) => i !== index);
                                                        setSelectedImages(newFiles);
                                                        setImagePreview(newPreviews);
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleCreatePlayerShow}
                                    disabled={uploadingImages}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {uploadingImages ? '上传中...' : '发布'}
                                </button>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                onEdit={handleEditPlayerShow}
                                onDelete={handleDeletePlayerShow}
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
const PlayerShowCard = ({ playerShow, currentUserId, onLike, onAddComment, onEdit, onDelete }) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
    const [editForm, setEditForm] = useState({
        title: playerShow.title,
        content: playerShow.content,
        images: playerShow.images || []
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const menuRef = useRef(null);
    const isLiked = playerShow.likedUsers?.includes(currentUserId);
    const isOwner = currentUserId === playerShow.userId;

    // 点击外部关闭菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowOptionsMenu(false);
            }
        };

        if (showOptionsMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOptionsMenu]);

    const handleSubmitComment = () => {
        if (newComment.trim()) {
            onAddComment(playerShow.id, newComment.trim());
            setNewComment('');
        }
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);

        // 创建预览
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
    };

    const handleImageUpload = async (files) => {
        if (!files || files.length === 0) return [];

        setUploadingImages(true);
        const uploadedUrls = [];

        try {
            for (let file of files) {
                const imageUrl = await uploadAPI.uploadImage(file);
                uploadedUrls.push(imageUrl);
            }
            return uploadedUrls;
        } catch (error) {
            console.error('图片上传失败:', error);
            return [];
        } finally {
            setUploadingImages(false);
        }
    };

    const handleSaveEdit = async () => {
        try {
            // 先上传新图片
            let newImageUrls = [];
            if (selectedImages.length > 0) {
                newImageUrls = await handleImageUpload(selectedImages);
            }

            // 合并现有图片和新图片
            const updatedImages = [...editForm.images, ...newImageUrls];

            const updatedData = {
                ...editForm,
                images: updatedImages
            };

            await onEdit(playerShow.id, updatedData);
            setShowEditForm(false);
            setSelectedImages([]);
            setImagePreview([]);
        } catch (error) {
            console.error('保存失败:', error);
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditForm({
            title: playerShow.title,
            content: playerShow.content,
            images: playerShow.images || []
        });
        setSelectedImages([]);
        setImagePreview([]);
    };

    const handleDelete = async () => {
        if (window.confirm('确定要删除这个玩家秀吗？')) {
            await onDelete(playerShow.id);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 头部 */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img
                            src={playerShow.user?.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"}
                            alt="用户头像"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                {playerShow.user?.username || '未知用户'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {new Date(playerShow.createTime).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* 操作菜单 */}
                    {isOwner && (
                        <div className="relative" ref={menuRef}>
                            <button
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>
                            {showOptionsMenu && (
                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10">
                                    <button
                                        onClick={() => {
                                            setShowOptionsMenu(false);
                                            setShowEditForm(true);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        编辑
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowOptionsMenu(false);
                                            handleDelete();
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        删除
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 编辑表单 */}
            {showEditForm && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                标题
                            </label>
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full p-2 border rounded"
                                placeholder="玩家秀标题"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                内容
                            </label>
                            <textarea
                                value={editForm.content}
                                onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                                className="w-full p-2 border rounded"
                                rows="4"
                                placeholder="分享你的开箱体验..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                添加图片（可选）
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="w-full p-2 border rounded"
                            />
                            {imagePreview.length > 0 && (
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {imagePreview.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt="预览"
                                                className="w-full h-24 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newFiles = selectedImages.filter((_, i) => i !== index);
                                                    const newPreviews = imagePreview.filter((_, i) => i !== index);
                                                    setSelectedImages(newFiles);
                                                    setImagePreview(newPreviews);
                                                }}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* 显示现有图片 */}
                            {editForm.images && editForm.images.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-2">现有图片：</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {editForm.images.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={image}
                                                    alt="现有图片"
                                                    className="w-full h-24 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newImages = editForm.images.filter((_, i) => i !== index);
                                                        setEditForm(prev => ({ ...prev, images: newImages }));
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSaveEdit}
                                disabled={uploadingImages}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                {uploadingImages ? '上传中...' : '保存'}
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${isLiked
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