import React, { useState } from 'react';

const SquareForBx = ({ blindBox }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(blindBox.likes || 0);
    const [showComments, setShowComments] = useState(false);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseQuantity, setPurchaseQuantity] = useState(1);

    const handleLike = () => {
        if (isLiked) {
            setLikeCount(likeCount - 1);
        } else {
            setLikeCount(likeCount + 1);
        }
        setIsLiked(!isLiked);
    };

    const handlePurchase = () => {
        setShowPurchaseModal(true);
    };

    const handleConfirmPurchase = () => {
        // 这里可以添加实际的购买逻辑
        alert(`购买成功！\n商品：${blindBox.title}\n数量：${purchaseQuantity}\n总价：¥${blindBox.price * purchaseQuantity}`);
        setShowPurchaseModal(false);
        setPurchaseQuantity(1);
    };

    const handleCancelPurchase = () => {
        setShowPurchaseModal(false);
        setPurchaseQuantity(1);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* 用户信息头部 */}
                <div className="flex items-center p-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img
                            src={blindBox.user.avatar || 'https://via.placeholder.com/40x40'}
                            alt={blindBox.user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{blindBox.user.name}</div>
                        <div className="text-gray-500 text-xs">{blindBox.postTime}</div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>
                </div>

                {/* 盲盒图片 */}
                <div className="relative">
                    <img
                        src={blindBox.image}
                        alt={blindBox.title}
                        className="w-full h-80 object-cover"
                    />
                    {/* 盲盒标签 */}
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {blindBox.category}
                    </div>
                    {/* 价格标签 */}
                    <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        ¥{blindBox.price}
                    </div>
                </div>

                {/* 内容区域 */}
                <div className="p-4">
                    {/* 标题 */}
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                        {blindBox.title}
                    </h3>

                    {/* 描述 */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {blindBox.description}
                    </p>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {blindBox.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* 盲盒信息 */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">盲盒系列</span>
                            <span className="font-medium">{blindBox.series}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                            <span className="text-gray-600">稀有度</span>
                            <span className={`font-medium ${blindBox.rarity === 'SSR' ? 'text-purple-600' :
                                    blindBox.rarity === 'SR' ? 'text-blue-600' :
                                        blindBox.rarity === 'R' ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                {blindBox.rarity}
                            </span>
                        </div>
                    </div>

                    {/* 购买按钮 */}
                    <div className="mb-3">
                        <button
                            onClick={handlePurchase}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                        >
                            🛒 立即购买 ¥{blindBox.price}
                        </button>
                    </div>

                    {/* 互动按钮 */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-500'
                                    } hover:text-red-500 transition-colors`}
                            >
                                <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-sm">{likeCount}</span>
                            </button>

                            <button
                                onClick={() => setShowComments(!showComments)}
                                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-sm">{blindBox.comments?.length || 0}</span>
                            </button>

                            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                                <span className="text-sm">分享</span>
                            </button>
                        </div>

                        <button className="text-gray-500 hover:text-gray-700 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </button>
                    </div>

                    {/* 评论区域 */}
                    {showComments && blindBox.comments && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="space-y-2">
                                {blindBox.comments.map((comment, index) => (
                                    <div key={index} className="flex items-start space-x-2">
                                        <img
                                            src={comment.user.avatar || 'https://via.placeholder.com/24x24'}
                                            alt={comment.user.name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-900">{comment.user.name}</span>
                                                <span className="text-gray-600 ml-2">{comment.content}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{comment.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 购买弹窗 */}
            {showPurchaseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">购买盲盒</h3>
                            <button
                                onClick={handleCancelPurchase}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center space-x-3 mb-3">
                                <img
                                    src={blindBox.image}
                                    alt={blindBox.title}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{blindBox.title}</h4>
                                    <p className="text-red-500 font-semibold">¥{blindBox.price}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-gray-600">系列</span>
                                    <span className="font-medium">{blindBox.series}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">稀有度</span>
                                    <span className={`font-medium ${blindBox.rarity === 'SSR' ? 'text-purple-600' :
                                            blindBox.rarity === 'SR' ? 'text-blue-600' :
                                                blindBox.rarity === 'R' ? 'text-green-600' : 'text-gray-600'
                                        }`}>
                                        {blindBox.rarity}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                购买数量
                            </label>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                                <span className="text-lg font-medium min-w-[3rem] text-center">{purchaseQuantity}</span>
                                <button
                                    onClick={() => setPurchaseQuantity(purchaseQuantity + 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>总计</span>
                                <span className="text-red-500">¥{blindBox.price * purchaseQuantity}</span>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={handleCancelPurchase}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleConfirmPurchase}
                                className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
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
