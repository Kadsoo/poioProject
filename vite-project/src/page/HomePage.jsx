import React, { useState, useEffect } from 'react';
import SquareForBx from './SquareForBx';
import UserSpace from './UserSpace';
import BlindBoxCreatePage from './BlindBoxCreatePage';
import BlindBoxDetailPage from './BlindBoxDetailPage';
import BlindBoxManagePage from './BlindBoxManagePage';
import NotificationPage from './NotificationPage';
import { blindBoxAPI } from '../services/api';

const HomePage = ({ onLogout }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('全部');
    const [selectedSort, setSelectedSort] = useState('最新发布');
    const [currentPage, setCurrentPage] = useState('home'); // 'home', 'cart', 'userSpace', 'detail', 'manage'
    const [blindBoxes, setBlindBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreatePage, setShowCreatePage] = useState(false);
    const [selectedBlindBox, setSelectedBlindBox] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const [notification, setNotification] = useState(null);

    // 从后端获取盲盒数据
    useEffect(() => {
        fetchBlindBoxes();
    }, []);

    const fetchBlindBoxes = async () => {
        try {
            setLoading(true);
            // 使用API服务获取盲盒数据
            const data = await blindBoxAPI.getBlindBoxes();
            setBlindBoxes(data);
        } catch (error) {
            console.error('获取盲盒数据失败:', error);
            // 使用模拟数据作为后备
            setBlindBoxes([
                {
                    id: 1,
                    title: "超可爱的泡泡玛特盲盒开箱！SSR隐藏款到手了！",
                    description: "今天终于抽到了心心念念的泡泡玛特系列隐藏款！这个系列的做工真的太精致了，每一个细节都完美还原。开箱的那一刻真的超级激动，没想到真的抽到了SSR！",
                    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=400&fit=crop",
                    price: 59,
                    category: "泡泡玛特",
                    series: "POP MART 系列",
                    likes: 128,
                    postTime: "2小时前",
                    user: {
                        name: "盲盒小达人",
                        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                    },
                    tags: ["泡泡玛特", "盲盒", "开箱", "SSR", "收藏"],
                    comments: [
                        {
                            user: { name: "盲盒爱好者", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" },
                            content: "太幸运了！我也想要这个隐藏款",
                            time: "1小时前"
                        }
                    ],
                    items: [
                        { name: "泡泡玛特系列隐藏款", probability: 0.001 },
                        { name: "POP MART 系列普通款", probability: 0.999 }
                    ]
                },
                {
                    id: 2,
                    title: "52TOYS猛兽匣系列开箱，这个做工绝了！",
                    description: "52TOYS的猛兽匣系列真的是国货之光！每一个细节都处理得非常好，关节可动性也很棒。这次抽到了SR级别的，虽然不是SSR但也很满意了！",
                    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
                    price: 89,
                    category: "52TOYS",
                    series: "猛兽匣系列",
                    likes: 95,
                    postTime: "4小时前",
                    user: {
                        name: "玩具收藏家",
                        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                    },
                    tags: ["52TOYS", "猛兽匣", "国货", "SR", "可动"],
                    comments: [
                        {
                            user: { name: "国货支持者", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face" },
                            content: "52TOYS确实不错，支持国货！",
                            time: "3小时前"
                        }
                    ],
                    items: [
                        { name: "52TOYS猛兽匣系列SR", probability: 0.01 },
                        { name: "52TOYS猛兽匣系列R", probability: 0.99 }
                    ]
                },
                {
                    id: 3,
                    title: "万代高达模型盲盒，拼装体验超棒！",
                    description: "万代的高达模型盲盒系列，虽然是R级别但拼装体验真的很棒！细节刻画很到位，适合新手入门。推荐给喜欢拼装的朋友们！",
                    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=400&fit=crop",
                    price: 129,
                    category: "万代",
                    series: "高达模型系列",
                    likes: 67,
                    postTime: "6小时前",
                    user: {
                        name: "模型达人",
                        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
                    },
                    tags: ["万代", "高达", "模型", "拼装", "R级"],
                    comments: [
                        {
                            user: { name: "拼装新手", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face" },
                            content: "新手适合吗？想入坑",
                            time: "5小时前"
                        }
                    ],
                    items: [
                        { name: "万代高达模型盲盒R", probability: 0.9 },
                        { name: "万代高达模型盲盒SR", probability: 0.1 }
                    ]
                },
                {
                    id: 4,
                    title: "乐高星球大战盲盒，收藏价值超高！",
                    description: "乐高的星球大战系列盲盒，这次抽到了千年隼号！虽然是R级别但收藏价值很高，细节还原度也很棒。乐高粉必入！",
                    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=400&fit=crop",
                    price: 199,
                    category: "乐高",
                    series: "星球大战系列",
                    likes: 156,
                    postTime: "8小时前",
                    user: {
                        name: "乐高收藏家",
                        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                    },
                    tags: ["乐高", "星球大战", "千年隼", "收藏", "R级"],
                    comments: [
                        {
                            user: { name: "星战迷", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face" },
                            content: "千年隼号太经典了！",
                            time: "7小时前"
                        }
                    ],
                    items: [
                        { name: "乐高星球大战盲盒R", probability: 0.9 },
                        { name: "乐高星球大战盲盒SR", probability: 0.1 }
                    ]
                },
                {
                    id: 5,
                    title: "万代奥特曼系列，童年回忆杀！",
                    description: "万代的奥特曼系列盲盒，这次抽到了迪迦奥特曼！做工很精致，关节可动性也不错。满满的童年回忆，奥特曼粉必收！",
                    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
                    price: 79,
                    category: "万代",
                    series: "奥特曼系列",
                    likes: 203,
                    postTime: "12小时前",
                    user: {
                        name: "奥特曼迷",
                        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                    },
                    tags: ["万代", "奥特曼", "迪迦", "童年", "SR"],
                    comments: [
                        {
                            user: { name: "光之巨人", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" },
                            content: "迪迦！我的童年偶像！",
                            time: "11小时前"
                        }
                    ],
                    items: [
                        { name: "万代奥特曼系列SR", probability: 0.1 },
                        { name: "万代奥特曼系列R", probability: 0.9 }
                    ]
                },
                {
                    id: 6,
                    title: "泡泡玛特SKULLPANDA系列，艺术感十足！",
                    description: "泡泡玛特的SKULLPANDA系列，这次抽到了艺术家款！设计很有艺术感，配色也很高级。这个系列真的很适合收藏！",
                    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=400&fit=crop",
                    price: 69,
                    category: "泡泡玛特",
                    series: "SKULLPANDA系列",
                    likes: 89,
                    postTime: "1天前",
                    user: {
                        name: "艺术收藏家",
                        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
                    },
                    tags: ["泡泡玛特", "SKULLPANDA", "艺术", "SSR", "收藏"],
                    comments: [
                        {
                            user: { name: "艺术爱好者", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face" },
                            content: "这个设计真的很艺术！",
                            time: "23小时前"
                        }
                    ],
                    items: [
                        { name: "泡泡玛特SKULLPANDA系列SSR", probability: 0.005 },
                        { name: "泡泡玛特SKULLPANDA系列SR", probability: 0.095 }
                    ]
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // 获取所有类别
    const categories = ['全部', ...new Set(blindBoxes.map(box => box.category))];

    // 为后端数据添加默认用户信息
    const processedBlindBoxes = blindBoxes.map(box => ({
        ...box,
        user: box.user || {
            name: "盲盒爱好者",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
        },
        tags: box.tags || [],
        comments: box.comments || []
    }));

    // 筛选逻辑
    const filteredBlindBoxes = processedBlindBoxes.filter(box => {
        const matchesSearch = box.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            box.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            box.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === '全部' || box.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // 排序逻辑
    const sortedBlindBoxes = [...filteredBlindBoxes].sort((a, b) => {
        switch (selectedSort) {
            case '最新发布':
                return new Date(b.postTime || b.posttime || 0) - new Date(a.postTime || a.posttime || 0);
            case '最多点赞':
                return (b.likes || 0) - (a.likes || 0);
            case '最多评论':
                return (b.comments?.length || 0) - (a.comments?.length || 0);
            case '价格从低到高':
                return (a.price || 0) - (b.price || 0);
            case '价格从高到低':
                return (b.price || 0) - (a.price || 0);
            default:
                return 0;
        }
    });

    const handleBackToHome = () => {
        setCurrentPage('home');
        setSelectedBlindBox(null);
    };

    // 查看盲盒详情
    const handleViewDetail = (blindBox) => {
        setSelectedBlindBox(blindBox);
        setCurrentPage('detail');
    };

    // 编辑盲盒
    const handleEditBlindBox = (blindBox) => {
        setSelectedBlindBox(blindBox);
        setShowCreatePage(true);
    };

    // 删除盲盒
    const handleDeleteBlindBox = async (id) => {
        setNotification({
            message: '确定要删除这个盲盒吗？',
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await blindBoxAPI.deleteBlindBox(id);
                    fetchBlindBoxes();
                    setNotification({ message: '删除成功', type: 'success' });
                } catch (e) {
                    setNotification({ message: '删除失败', type: 'error' });
                }
            },
            onCancel: () => setNotification(null)
        });
    };

    // 跳转到管理页面
    const handleGoToManage = () => {
        setCurrentPage('manage');
    };

    // 如果当前页面是用户空间，显示用户空间页面
    if (currentPage === 'userSpace') {
        return <UserSpace onBack={handleBackToHome} />;
    }

    // 如果当前页面是详情页面，显示详情页面
    if (currentPage === 'detail' && selectedBlindBox) {
        return (
            <BlindBoxDetailPage
                blindBox={selectedBlindBox}
                onBack={handleBackToHome}
                onEdit={handleEditBlindBox}
                onDelete={handleDeleteBlindBox}
                currentUserId={user?.id}
            />
        );
    }

    // 如果当前页面是管理页面，显示管理页面
    if (currentPage === 'manage') {
        return (
            <BlindBoxManagePage
                onBack={handleBackToHome}
                currentUserId={user?.id}
            />
        );
    }

    if (showCreatePage) {
        return <BlindBoxCreatePage onBack={() => setShowCreatePage(false)} onSuccess={() => { setShowCreatePage(false); fetchBlindBoxes(); }} />;
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
            {/* 顶部导航栏 */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">盲盒社区</h1>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="搜索盲盒、标签..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setCurrentPage('userSpace')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                            <button
                                onClick={handleGoToManage}
                                className="text-gray-600 hover:text-gray-900"
                                title="我的盲盒"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setShowCreatePage(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                            >
                                发布盲盒
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" alt="用户头像" className="w-full h-full object-cover" />
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="text-gray-600 hover:text-red-600 transition-colors text-sm"
                                >
                                    退出登录
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 筛选栏 */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700">筛选：</span>

                        {/* 类别筛选 */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">类别</span>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* 排序 */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">排序</span>
                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="最新发布">最新发布</option>
                                <option value="最多点赞">最多点赞</option>
                                <option value="最多评论">最多评论</option>
                                <option value="价格从低到高">价格从低到高</option>
                                <option value="价格从高到低">价格从高到低</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* 主要内容区域 */}
            <div className="container mx-auto px-4 py-6">
                {/* 统计信息 */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        找到 <span className="font-semibold text-blue-600">{sortedBlindBoxes.length}</span> 个盲盒
                        {searchTerm && `，搜索关键词："${searchTerm}"`}
                    </p>
                </div>

                {/* 加载状态 */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-600">正在加载盲盒数据...</p>
                    </div>
                )}

                {/* 盲盒网格 */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedBlindBoxes.map(blindBox => (
                            <SquareForBx
                                key={blindBox.id}
                                blindBox={blindBox}
                                currentUserId={user?.id}
                                onDelete={handleDeleteBlindBox}
                                onViewDetail={handleViewDetail}
                                onEdit={handleEditBlindBox}
                            />
                        ))}
                    </div>
                )}

                {/* 加载更多 */}
                {!loading && sortedBlindBoxes.length > 0 && (
                    <div className="text-center mt-8">
                        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            加载更多
                        </button>
                    </div>
                )}

                {/* 空状态 */}
                {!loading && sortedBlindBoxes.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到相关盲盒</h3>
                        <p className="mt-1 text-sm text-gray-500">尝试调整搜索条件或筛选器</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage; 