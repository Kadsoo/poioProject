import React, { useState } from 'react';
import { blindBoxAPI } from '../services/api';
import NotificationPage from './NotificationPage';

const BlindBoxCreatePage = ({ onBack, onSuccess, editingBlindBox }) => {
    const [title, setTitle] = useState(editingBlindBox?.title || '');
    const [description, setDescription] = useState(editingBlindBox?.description || '');
    const [image, setImage] = useState(editingBlindBox?.image || '');
    const [price, setPrice] = useState(editingBlindBox?.price?.toString() || '');
    const [items, setItems] = useState(editingBlindBox?.items || []);
    const [itemName, setItemName] = useState('');
    const [itemProb, setItemProb] = useState('');
    const [notification, setNotification] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
    };

    const handleAddItem = () => {
        if (!itemName || !itemProb) {
            showNotification('请填写物品名称和概率', 'warning');
            return;
        }
        setItems([...items, { name: itemName, probability: parseFloat(itemProb) }]);
        setItemName('');
        setItemProb('');
    };

    const handleRemoveItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const handleSubmit = async () => {
        if (!title || !price || items.length === 0) {
            showNotification('标题、价格和至少一个物品必填', 'warning');
            return;
        }
        // 概率和校验
        const probSum = items.reduce((sum, item) => sum + Number(item.probability), 0);
        if (Math.abs(probSum - 1) > 1e-6) {
            showNotification('所有物品的概率之和必须为1，当前为：' + probSum, 'warning');
            return;
        }
        try {
            const blindBoxData = {
                title,
                description,
                image,
                price: Number(price),
                items,
                userId: user.id,
            };

            if (editingBlindBox) {
                // 更新模式
                await blindBoxAPI.updateBlindBox(editingBlindBox.id, blindBoxData);
                showNotification('更新成功', 'success');
            } else {
                // 创建模式
                await blindBoxAPI.createBlindBox(blindBoxData);
                showNotification('发布成功', 'success');
            }

            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1200);
        } catch (e) {
            showNotification(editingBlindBox ? '更新失败' : '发布失败', 'error');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            {notification && (
                <NotificationPage
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {editingBlindBox ? '编辑盲盒' : '发布新盲盒'}
                </h2>
                <input
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="标题"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <input
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="图片URL"
                    value={image}
                    onChange={e => setImage(e.target.value)}
                />
                <input
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="价格"
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
                <textarea
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="描述"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <div className="mb-4">
                    <div className="flex space-x-2 mb-2">
                        <input
                            className="flex-1 p-2 border rounded"
                            placeholder="物品名称"
                            value={itemName}
                            onChange={e => setItemName(e.target.value)}
                        />
                        <input
                            className="w-24 p-2 border rounded"
                            placeholder="概率(0-1)"
                            type="number"
                            step="0.01"
                            value={itemProb}
                            onChange={e => setItemProb(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                            onClick={handleAddItem}
                        >添加</button>
                    </div>
                    <ul>
                        {items.map((item, idx) => (
                            <li key={idx} className="flex items-center justify-between py-1">
                                <span>{item.name}（概率：{item.probability}）</span>
                                <button
                                    className="text-red-500 hover:underline text-xs"
                                    onClick={() => handleRemoveItem(idx)}
                                >删除</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex space-x-2 mt-4">
                    <button
                        className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleSubmit}
                    >发布</button>
                    <button
                        className="flex-1 py-2 border border-gray-300 rounded"
                        onClick={onBack}
                    >返回</button>
                </div>
            </div>
        </div>
    );
};

export default BlindBoxCreatePage; 