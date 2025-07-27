import React, { useState, useEffect } from 'react';
import SquareForBx from './SquareForBx';
import UserSpace from './UserSpace';
import BlindBoxCreatePage from './BlindBoxCreatePage';
import BlindBoxDetailPage from './BlindBoxDetailPage';
import BlindBoxManagePage from './BlindBoxManagePage';
import PlayerShowPage from './PlayerShowPage';
import NotificationPage from './NotificationPage';
import { blindBoxAPI } from '../services/api';

const HomePage = ({ onLogout }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('全部');
    const [selectedSort, setSelectedSort] = useState('最新发布');
    const [currentPage, setCurrentPage] = useState('home'); // 'home', 'cart', 'userSpace', 'detail', 'manage', 'playershow'
    const [blindBoxes, setBlindBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showCreatePage, setShowCreatePage] = useState(false);
    const [selectedBlindBox, setSelectedBlindBox] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const [notification, setNotification] = useState(null);

    // 分页状态
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);

    // 从后端获取盲盒数据
    useEffect(() => {
        fetchBlindBoxes();
    }, []);

    const fetchBlindBoxes = async (pageNum = 1, append = false) => {
        try {
            if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            // 使用API服务获取盲盒数据
            const response = await blindBoxAPI.getBlindBoxes(pageNum);

            if (response.success) {
                const { data, pagination } = response;

                if (append) {
                    // 追加数据
                    setBlindBoxes(prev => [...prev, ...data]);
                } else {
                    // 替换数据
                    setBlindBoxes(data);
                }

                setPage(pagination.page);
                setHasMore(pagination.hasMore);
                setTotal(pagination.total);
            } else {
                console.error('获取盲盒数据失败:', response.message);
                setNotification({
                    type: 'error',
                    message: '获取盲盒数据失败: ' + response.message
                });
            }
        } catch (error) {
            console.error('获取盲盒数据失败:', error);
            setNotification({
                type: 'error',
                message: '网络错误，无法获取盲盒数据'
            });
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // 加载更多盲盒
    const handleLoadMore = async () => {
        if (hasMore && !loadingMore) {
            await fetchBlindBoxes(page + 1, true);
        }
    };

    // 初始化示例数据
    const initSampleData = async () => {
        try {
            setLoading(true);
            const response = await blindBoxAPI.initData();
            if (response.success) {
                setNotification({
                    type: 'success',
                    message: response.message
                });
                // 重新获取数据
                await fetchBlindBoxes(1, false);
            } else {
                setNotification({
                    type: 'error',
                    message: '初始化数据失败: ' + response.message
                });
            }
        } catch (error) {
            console.error('初始化数据失败:', error);
            setNotification({
                type: 'error',
                message: '初始化数据失败'
            });
        } finally {
            setLoading(false);
        }
    };

    // 获取所有类别
    const categories = ['全部', ...new Set(blindBoxes.map(box => box.category))];

    // 处理盲盒数据，确保包含用户信息
    const processedBlindBoxes = blindBoxes.map(blindBox => ({
        ...blindBox,
        user: blindBox.user || {
            name: "未知用户",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
        },
        tags: blindBox.tags || [],
        comments: blindBox.comments || []
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

    // 玩家秀页面
    if (currentPage === 'playershow') {
        return <PlayerShowPage onBack={() => setCurrentPage('home')} />;
    }

    // 盲盒详情页面
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
                        {/* 导航按钮 */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setCurrentPage('home')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                首页
                            </button>
                            <button
                                onClick={() => setCurrentPage('playershow')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                玩家秀
                            </button>
                            <button
                                onClick={() => setCurrentPage('manage')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                我的盲盒
                            </button>
                            <button
                                onClick={() => setCurrentPage('userSpace')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                个人空间
                            </button>
                            <button
                                onClick={onLogout}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                退出登录
                            </button>
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
                        找到 <span className="font-semibold text-blue-600">{total}</span> 个盲盒
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
                {!loading && sortedBlindBoxes.length > 0 && hasMore && (
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
                                `加载更多 (${sortedBlindBoxes.length}/${total})`
                            )}
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
                        <p className="mt-1 text-sm text-gray-500">尝试调整搜索条件或初始化示例数据</p>
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

export default HomePage; 