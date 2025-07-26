import React, { useEffect } from 'react';

const NotificationPage = ({
    message,
    type = 'info',
    onClose,
    onConfirm,
    onCancel,
    duration = 3000,
    showButtons = false,
    confirmText = '确认',
    cancelText = '取消'
}) => {
    useEffect(() => {
        // 只有非确认类型的通知才自动关闭
        if (type !== 'confirm' && duration > 0) {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose, type]);

    // 根据类型设置样式
    let bgColor = 'bg-blue-500';
    let borderColor = 'border-blue-200';
    let icon = null;

    switch (type) {
        case 'success':
            bgColor = 'bg-green-500';
            borderColor = 'border-green-200';
            icon = (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            );
            break;
        case 'error':
            bgColor = 'bg-red-500';
            borderColor = 'border-red-200';
            icon = (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            );
            break;
        case 'warning':
            bgColor = 'bg-yellow-500';
            borderColor = 'border-yellow-200';
            icon = (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            );
            break;
        case 'confirm':
            bgColor = 'bg-blue-500';
            borderColor = 'border-blue-200';
            icon = (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
            break;
        default:
            icon = (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
    }

    return (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4`}>
            <div
                className={`${bgColor} bg-opacity-80 backdrop-blur-sm text-white rounded-lg shadow-lg border ${borderColor} transform transition-all duration-300 ease-out`}
            >
                {/* 头部 */}
                <div className="flex items-center justify-between p-3 border-b border-white border-opacity-20">
                    <div className="flex items-center space-x-2">
                        {icon}
                        <span className="text-sm font-semibold">
                            {type === 'success' && '成功'}
                            {type === 'error' && '错误'}
                            {type === 'warning' && '警告'}
                            {type === 'confirm' && '确认'}
                            {type === 'info' && '提示'}
                        </span>
                    </div>
                    {type !== 'confirm' && (
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* 消息内容 */}
                <div className="p-3">
                    <p className="text-white text-sm leading-relaxed whitespace-pre-line">
                        {message}
                    </p>
                </div>

                {/* 按钮区域 */}
                {(type === 'confirm' || showButtons) && (
                    <div className="flex justify-end space-x-2 p-3 border-t border-white border-opacity-20">
                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className="px-3 py-1 bg-white bg-opacity-20 text-white rounded text-sm hover:bg-opacity-30 transition-colors"
                            >
                                {cancelText}
                            </button>
                        )}
                        {onConfirm && (
                            <button
                                onClick={onConfirm}
                                className="px-3 py-1 bg-white text-gray-800 rounded text-sm hover:bg-gray-100 transition-colors font-medium"
                            >
                                {confirmText}
                            </button>
                        )}
                        {!onConfirm && onClose && (
                            <button
                                onClick={onClose}
                                className="px-3 py-1 bg-white text-gray-800 rounded text-sm hover:bg-gray-100 transition-colors font-medium"
                            >
                                确定
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPage; 