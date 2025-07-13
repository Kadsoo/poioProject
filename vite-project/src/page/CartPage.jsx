import React, { useState } from 'react';

const CartPage = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('purchases'); // 'purchases' or 'favorites'

    // 模拟购买记录数据
    const [purchases] = useState([
        {
            id: 1,
            blindBox: {
                id: 1,
                title: "超可爱的泡泡玛特盲盒开箱！SSR隐藏款到手了！",
                image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=400&fit=crop",
                price: 59,
                category: "泡泡玛特",
                series: "POP MART 系列",
                rarity: "SSR"
            },
            quantity: 2,
            purchaseDate: "2024-01-15",
            status: "已发货"
        },
        {
            id: 2,
            blindBox: {
                id: 2,
                title: "52TOYS猛兽匣系列开箱，这个做工绝了！",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
                price: 89,
                category: "52TOYS",
                series: "猛兽匣系列",
                rarity: "SR"
            },
            quantity: 1,
            purchaseDate: "2024-01-10",
            status: "已收货"
        }
    ]);

    // 模拟收藏数据
    const [favorites] = useState([
        {
            id: 3,
            title: "万代高达模型盲盒，拼装体验超棒！",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=400&fit=crop",
            price: 129,
            category: "万代",
            series: "高达模型系列",
            rarity: "R"
        },
        {
            id: 4,
            title: "乐高星球大战盲盒，收藏价值超高！",
            image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=400&fit=crop",
            price: 199,
            category: "乐高",
            series: "星球大战系列",
            rarity: "R"
        }
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case '已发货':
                return 'text-blue-600 bg-blue-100';
            case '已收货':
                return 'text-green-600 bg-green-100';
            case '待发货':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

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
                            <h1 className="text-2xl font-bold text-gray-900">我的订单</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" alt="用户头像" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 标签页 */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('purchases')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'purchases'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            购买记录 ({purchases.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'favorites'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            我的收藏 ({favorites.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* 内容区域 */}
            <div className="container mx-auto px-4 py-6">
                {activeTab === 'purchases' ? (
                    <div className="space-y-4">
                        {purchases.map((purchase) => (
                            <div key={purchase.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-start space-x-4">
                                    <img
                                        src={purchase.blindBox.image}
                                        alt={purchase.blindBox.title}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                                            {purchase.blindBox.title}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                                            <span>{purchase.blindBox.series}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${purchase.blindBox.rarity === 'SSR' ? 'text-purple-600 bg-purple-100' :
                                                    purchase.blindBox.rarity === 'SR' ? 'text-blue-600 bg-blue-100' :
                                                        purchase.blindBox.rarity === 'R' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                                                }`}>
                                                {purchase.blindBox.rarity}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-600">
                                                <span>数量: {purchase.quantity}</span>
                                                <span className="mx-2">|</span>
                                                <span>总价: ¥{purchase.blindBox.price * purchase.quantity}</span>
                                                <span className="mx-2">|</span>
                                                <span>购买时间: {purchase.purchaseDate}</span>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                                                {purchase.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {purchases.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">暂无购买记录</h3>
                                <p className="mt-1 text-sm text-gray-500">快去购买你喜欢的盲盒吧！</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((favorite) => (
                            <div key={favorite.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative">
                                    <img
                                        src={favorite.image}
                                        alt={favorite.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                        {favorite.category}
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                        ¥{favorite.price}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
                                        {favorite.title}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{favorite.series}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${favorite.rarity === 'SSR' ? 'text-purple-600 bg-purple-100' :
                                                favorite.rarity === 'SR' ? 'text-blue-600 bg-blue-100' :
                                                    favorite.rarity === 'R' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                                            }`}>
                                            {favorite.rarity}
                                        </span>
                                    </div>
                                    <button className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm">
                                        立即购买
                                    </button>
                                </div>
                            </div>
                        ))}

                        {favorites.length === 0 && (
                            <div className="col-span-full text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">暂无收藏</h3>
                                <p className="mt-1 text-sm text-gray-500">收藏你喜欢的盲盒，方便下次购买</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage; 