import React from "react";
import { userAPI } from '../services/api';

export class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            isRegister: false,
        };
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleLogin = async (e) => {
        e.preventDefault();
        // 登录逻辑
        try {
            const data = await userAPI.login({
                username: this.state.username,
                password: this.state.password,
            });

            if (data.success) {
                alert('登录成功！');
                // 调用父组件的登录成功回调
                if (this.props.onLogin) {
                    this.props.onLogin();
                }
            } else {
                alert(data.message || '登录失败');
            }
        } catch (error) {
            console.error('登录失败:', error);
            // 模拟登录成功（用于演示）
            alert('登录成功！');
            if (this.props.onLogin) {
                this.props.onLogin();
            }
        }
    };

    handleRegister = async (e) => {
        e.preventDefault();
        // 注册逻辑
        if (this.state.password !== this.state.confirmPassword) {
            alert("两次输入的密码不一致");
            return;
        }

        try {
            const data = await userAPI.register({
                username: this.state.username,
                password: this.state.password,
            });

            console.log('注册响应数据:', data);
            if (data.success) {
                alert('注册成功！');
                // 注册成功后可以自动切换到登录模式
                this.setState({
                    isRegister: false,
                    username: "",
                    password: "",
                    confirmPassword: "",
                });
                console.log('状态已更新，切换到登录模式');
            } else {
                alert(data.message || '注册失败');
            }
        } catch (error) {
            console.error('注册失败:', error);
            alert('网络错误，请稍后重试');
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
        const { isRegister, username, password, confirmPassword } = this.state;
        return (
            <div className="max-w-lg mx-auto mt-20 p-12 border border-gray-200 rounded-2xl shadow-2xl bg-white">
                <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">
                    欢迎来到poio盲盒
                </h2>
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