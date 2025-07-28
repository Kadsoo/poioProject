import './App.css'
import { LoginPage } from './page/LoginPage';
import HomePage from './page/HomePage';
import { useState, useEffect } from 'react';

const users = [
  { id: 1, name: 'jason' }, { id: 2, name: 'kadso' }, { id: 3, name: 'Jane' },
];

const getIsLoggedIn = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return !!(user && user.id);
  } catch {
    return false;
  }
};

const App = () => {
  // 登录状态根据 localStorage 初始化
  const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn);

  // 登录时设置状态
  const handleLogin = () => {
    console.log('登录成功，切换到主页');
    setIsLoggedIn(true);
  };

  // 登出时清空 localStorage
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  // 监听 localStorage 变化（多标签页同步，可选）
  useEffect(() => {
    const onStorage = () => {
      setIsLoggedIn(getIsLoggedIn());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // 添加调试信息
  useEffect(() => {
    console.log('当前登录状态:', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn ? (
        <HomePage onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
};

export default App
