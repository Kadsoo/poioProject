import React from "react";
import { userAPI } from '../services/api';
import NotificationPage from './NotificationPage';

export class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            isRegister: false,
            notification: null,
        };
    }

    showNotification = (message, type = 'info') => {
        this.setState({ notification: { message, type } });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleLogin = async (e) => {
        e.preventDefault();
        console.log('开始登录流程...');
        // 登录逻辑
        try {
            const data = await userAPI.login({
                username: this.state.username,
                password: this.state.password,
            });

            console.log('登录API响应:', data);

            if (data.success) {
                console.log('登录成功，保存用户信息');
                this.showNotification('登录成功！', 'success');
                // 保存用户信息
                localStorage.setItem('user', JSON.stringify(data.data));
                console.log('用户信息已保存到localStorage');
                // 调用父组件的登录回调
                if (this.props.onLogin) {
                    console.log('调用父组件登录回调');
                    this.props.onLogin();
                } else {
                    console.log('父组件没有提供onLogin回调');
                }
            } else {
                console.log('登录失败:', data.message);
                this.showNotification(data.message || '登录失败', 'error');
            }
        } catch (error) {
            console.error('登录异常:', error);
            this.showNotification(error.data?.message || '登录失败', 'error');
        }
    };

    handleRegister = async (e) => {
        e.preventDefault();
        // 注册逻辑
        if (this.state.password !== this.state.confirmPassword) {
            this.showNotification("两次输入的密码不一致", 'warning');
            return;
        }

        try {
            const data = await userAPI.register({
                username: this.state.username,
                password: this.state.password,
            });

            if (data.success) {
                this.showNotification('注册成功！', 'success');
                this.setState({
                    isRegister: false,
                    username: "",
                    password: "",
                    confirmPassword: "",
                });
            } else {
                this.showNotification(data.message || '注册失败', 'error');
            }
        } catch (error) {
            console.error('注册失败:', error);
            this.showNotification('网络错误，请稍后重试', 'error');
        }
    };

    toggleMode = () => {
        this.setState((prev) => ({
            isRegister: !prev.isRegister,
            username: "",
            password: "",
            confirmPassword: "",
        }));
    };

    render() {
        const { isRegister, username, password, confirmPassword, notification } = this.state;
        return (
            <div className="max-w-lg mx-auto mt-20 p-12 border border-gray-200 rounded-2xl shadow-2xl bg-white">
                {notification && (
                    <NotificationPage
                        message={notification.message}
                        type={notification.type}
                        onClose={() => this.setState({ notification: null })}
                    />
                )}
                <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">
                    欢迎来到poio盲盒
                </h2>
                {/* 注册要求提示 */}
                {isRegister && (
                    <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded">
                        <div className="font-semibold mb-1">注册须知：</div>
                        <ul className="list-disc pl-5 text-sm">
                            <li>用户名长度需在 <b>3-20</b> 个字符之间</li>
                            <li>密码长度需<strong>不少于6个字符</strong></li>
                            <li>用户名不可重复</li>
                        </ul>
                    </div>
                )}
                <form onSubmit={isRegister ? this.handleRegister : this.handleLogin}>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">
                            用户名：
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={this.handleInputChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                                required
                            />
                        </label>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">
                            密码：
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={this.handleInputChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                                required
                            />
                        </label>
                    </div>
                    {isRegister && (
                        <div className="mb-8">
                            <label className="block text-gray-700 mb-2">
                                确认密码：
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={this.handleInputChange}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                                    required
                                />
                            </label>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white text-lg font-semibold rounded hover:bg-blue-600 transition mb-4"
                    >
                        {isRegister ? "注册" : "登录"}
                    </button>
                </form>
                <div className="text-center">
                    <button
                        type="button"
                        className="w-full py-3 text-blue-400 hover:underline focus:outline-none "
                        onClick={this.toggleMode}
                    >
                        {isRegister ? "已有账号？去登录" : "没有账号？去注册"}
                    </button>
                </div>
            </div>
        );
    }
}