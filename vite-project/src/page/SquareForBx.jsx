import React, { useState, useEffect, useRef } from 'react';
import { orderAPI, blindBoxAPI } from '../services/api';
import NotificationPage from './NotificationPage';

const SquareForBx = ({ blindBox, currentUserId, onDelete, onViewDetail, onEdit }) => {
    const [isLiked, setIsLiked] = useState(blindBox.likedUsers?.includes(currentUserId) || false);
    const [likeCount, setLikeCount] = useState(blindBox.likes || 0);
    const [showComments, setShowComments] = useState(false);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [purchaseQuantity, setPurchaseQuantity] = useState(1);
    const [notification, setNotification] = useState(null);
    const [purchaseResult, setPurchaseResult] = useState(null);
    const menuRef = useRef(null);

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

    const handleLike = async () => {
        if (!currentUserId) {
            setNotification({ message: '请先登录', type: 'error' });
            return;
        }

        try {
            const response = isLiked
                ? await blindBoxAPI.unlikeBlindBox(blindBox.id, currentUserId)
                : await blindBoxAPI.likeBlindBox(blindBox.id, currentUserId);

            if (response.success) {
                setIsLiked(!isLiked);
                setLikeCount(response.data.likes);
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

    const handlePurchase = () => {
        setShowPurchaseModal(true);
    };

    const handleConfirmPurchase = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                setNotification({ message: '请先登录', type: 'error' });
                return;
            }

            const result = await orderAPI.purchaseBlindBox({
                userId: user.id,
                blindBoxId: blindBox.id,
                quantity: purchaseQuantity
            });

            if (result.success) {
                setPurchaseResult(result.data);
                setNotification({
                    message: `购买成功！\n抽到了：${result.data.items.map(item => item.name).join(', ')}`,
                    type: 'success'
                });
                setShowPurchaseModal(false);
                setPurchaseQuantity(1);
            } else {
                setNotification({ message: result.message || '购买失败', type: 'error' });
            }
        } catch (error) {
            setNotification({ message: '购买失败，请稍后重试', type: 'error' });
        }
    };

    const handleCancelPurchase = () => {
        setShowPurchaseModal(false);
        setPurchaseQuantity(1);
    };

    return (
        <>
            {notification && (
                <NotificationPage
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* 用户信息头部 */}
                <div className="flex items-center p-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img
                            src={blindBox.user?.avatar || 'https://via.placeholder.com/40x40'}
                            alt={blindBox.user?.name || '用户'}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{blindBox.user?.name || '用户'}</div>
                        <div className="text-gray-500 text-xs">{blindBox.postTime}</div>
                    </div>
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
                                        if (onViewDetail) onViewDetail(blindBox);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    查看详情
                                </button>
                                {currentUserId === blindBox.userId && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setShowOptionsMenu(false);
                                                if (onEdit) onEdit(blindBox);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            编辑
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowOptionsMenu(false);
                                                if (onDelete) onDelete(blindBox.id);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            删除
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 盲盒图片 */}
                <div className="relative">
                    <img
                        src={blindBox.image}
                        alt={blindBox.title}
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        ¥{blindBox.price}
                    </div>
                </div>

                {/* 内容区域 */}
                <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{blindBox.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blindBox.description}</p>

                    {/* 统计信息 */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>点赞 {likeCount}</span>
                        <span>评论 {blindBox.comments?.length || 0}</span>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex space-x-2">
                        <button
                            onClick={handleLike}
                            className={`flex-1 py-2 px-3 rounded-lg transition ${isLiked
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {isLiked ? '已点赞' : '点赞'}
                        </button>
                        <button
                            onClick={handlePurchase}
                            className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            购买
                        </button>
                    </div>
                </div>
            </div>

            {/* 购买弹窗 */}
            {showPurchaseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold mb-4">购买盲盒</h3>
                        <div className="mb-4">
                            <p className="text-gray-600 mb-2">盲盒：{blindBox.title}</p>
                            <p className="text-gray-600 mb-2">价格：¥{blindBox.price}</p>
                            <div className="flex items-center space-x-2">
                                <label className="text-gray-600">数量：</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={purchaseQuantity}
                                    onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                                    className="w-20 p-1 border rounded"
                                />
                            </div>
                            <p className="text-gray-600 mt-2">总价：¥{blindBox.price * purchaseQuantity}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleCancelPurchase}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleConfirmPurchase}
                                className="flex-1 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                确认购买
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SquareForBx;
