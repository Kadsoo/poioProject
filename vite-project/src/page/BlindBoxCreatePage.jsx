import React, { useState } from 'react';
import { blindBoxAPI, uploadAPI } from '../services/api';
import NotificationPage from './NotificationPage';

const BlindBoxCreatePage = ({ onBack, onSuccess, editingBlindBox }) => {
    const [formData, setFormData] = useState({
        title: editingBlindBox?.title || '',
        description: editingBlindBox?.description || '',
        price: editingBlindBox?.price || '',
        category: editingBlindBox?.category || '',
        series: editingBlindBox?.series || '',
        tags: editingBlindBox?.tags?.join(', ') || '',
        image: editingBlindBox?.image || ''
    });
    const [items, setItems] = useState(editingBlindBox?.items || [{ name: '', probability: 0 }]);
    const [notification, setNotification] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(editingBlindBox?.image || '');

    const handleImageUpload = async (file) => {
        if (!file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadAPI.uploadImage(file);
            setFormData(prev => ({ ...prev, image: imageUrl }));
            setImagePreview(imageUrl); // 使用服务器URL而不是本地预览
            setNotification({ message: '图片上传成功', type: 'success' });
        } catch (error) {
            setNotification({ message: '图片上传失败: ' + error.message, type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // 创建本地预览（仅用于预览，上传后会替换为服务器URL）
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddItem = () => {
        setItems([...items, { name: '', probability: 0 }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 验证概率总和
        const totalProbability = items.reduce((sum, item) => sum + (item.probability || 0), 0);
        if (Math.abs(totalProbability - 1) > 0.01) {
            setNotification({ message: '所有物品的概率总和必须为1', type: 'error' });
            return;
        }

        // 如果有选择的文件但还没有上传，先上传
        if (selectedFile && !formData.image.startsWith('/uploads/')) {
            try {
                const imageUrl = await uploadAPI.uploadImage(selectedFile);
                setFormData(prev => ({ ...prev, image: imageUrl }));
            } catch (error) {
                setNotification({ message: '图片上传失败: ' + error.message, type: 'error' });
                return;
            }
        }

        const user = JSON.parse(localStorage.getItem('user'));
        const blindBoxData = {
            ...formData,
            price: parseFloat(formData.price),
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            items: items.filter(item => item.name && item.probability > 0),
            userId: user.id
        };

        try {
            if (editingBlindBox) {
                await blindBoxAPI.updateBlindBox(editingBlindBox.id, blindBoxData);
                setNotification({ message: '盲盒更新成功', type: 'success' });
            } else {
                await blindBoxAPI.createBlindBox(blindBoxData);
                setNotification({ message: '盲盒创建成功', type: 'success' });
            }
            onSuccess();
        } catch (error) {
            setNotification({ message: '操作失败: ' + error.message, type: 'error' });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {editingBlindBox ? '编辑盲盒' : '发布新盲盒'}
                </h2>
                <input
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="盲盒标题"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
                <textarea
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="盲盒描述"
                    rows="3"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                <input
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="价格"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
                <input
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="类别"
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                />
                <input
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="系列"
                    value={formData.series}
                    onChange={e => setFormData(prev => ({ ...prev, series: e.target.value }))}
                />
                <input
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="标签（用逗号分隔）"
                    value={formData.tags}
                    onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                />

                {/* 图片上传 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        盲盒图片 *
                    </label>
                    <div className="space-y-4">
                        {/* 图片预览 */}
                        {imagePreview && (
                            <div className="relative">
                                <img
                                    src={imagePreview.startsWith('http') ? imagePreview : `http://127.0.0.1:7001${imagePreview}`}
                                    alt="预览"
                                    className="w-full h-48 object-cover rounded-lg border"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview('');
                                        setSelectedFile(null);
                                        setFormData(prev => ({ ...prev, image: '' }));
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {/* 文件上传 */}
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {selectedFile && (
                                <button
                                    type="button"
                                    onClick={() => handleImageUpload(selectedFile)}
                                    disabled={uploading}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {uploading ? '上传中...' : '上传图片'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        盲盒物品 *
                    </label>
                    {items.map((item, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                            <input
                                className="flex-1 p-2 border rounded"
                                placeholder="物品名称"
                                value={item.name}
                                onChange={e => {
                                    const newItems = [...items];
                                    newItems[index].name = e.target.value;
                                    setItems(newItems);
                                }}
                            />
                            <input
                                className="w-24 p-2 border rounded"
                                placeholder="概率"
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={item.probability}
                                onChange={e => {
                                    const newItems = [...items];
                                    newItems[index].probability = parseFloat(e.target.value) || 0;
                                    setItems(newItems);
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                删除
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        添加物品
                    </button>
                    <div className="mt-2 text-sm text-gray-600">
                        概率总和: {items.reduce((sum, item) => sum + (item.probability || 0), 0).toFixed(2)}
                    </div>
                </div>
                <div className="flex space-x-2 mt-4">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        {editingBlindBox ? '更新盲盒' : '创建盲盒'}
                    </button>
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        取消
                    </button>
                </div>
            </form>

            {notification && (
                <NotificationPage
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default BlindBoxCreatePage; 