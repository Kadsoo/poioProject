import './App.css'
import { LoginPage } from './page/LoginPage';
import HomePage from './page/HomePage';
import { useState } from 'react';

const users = [
  { id: 1, name: 'jason' }, { id: 2, name: 'kadso' }, { id: 3, name: 'Jane' },
];

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

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
