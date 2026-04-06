import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/index.css';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav>
      <div className="container">
        <Link to="/" className="nav-logo">
          🎓 Система тестирования
        </Link>
        <ul className="nav-links">
          {isAuthenticated && (
            <>
              <li><Link to="/tests">Тесты</Link></li>
              <li><Link to="/results">Мои результаты</Link></li>
              <li><Link to="/leaderboard">Лидерборд</Link></li>
              {user?.role === 'admin' && (
                <li><Link to="/admin">Админ панель</Link></li>
              )}
              <li className="text-muted">
                Привет, {user?.name}!
              </li>
              <li>
                <button onClick={logout}>Выход</button>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li><Link to="/login">Вход</Link></li>
              <li><Link to="/register">Регистрация</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
