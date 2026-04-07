import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/index.css';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav>
      <div className="container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          🎓 Система тестирования
        </Link>
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label="Открыть меню"
        >
          ☰
        </button>
        <ul className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          {isAuthenticated && (
            <>
              <li><Link to="/tests" onClick={closeMenu}>Тесты</Link></li>
              <li><Link to="/results" onClick={closeMenu}>Мои результаты</Link></li>
              <li><Link to="/leaderboard" onClick={closeMenu}>Лидерборд</Link></li>
              {user?.role === 'admin' && (
                <li><Link to="/admin" onClick={closeMenu}>Админ панель</Link></li>
              )}
              <li className="text-muted nav-user">
                Привет, {user?.name}!
              </li>
              <li>
                <button onClick={handleLogout}>Выход</button>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li><Link to="/login" onClick={closeMenu}>Вход</Link></li>
              <li><Link to="/register" onClick={closeMenu}>Регистрация</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
