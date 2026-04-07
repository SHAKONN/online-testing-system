import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
  const getLinkClassName = ({ isActive }) => (isActive ? 'nav-link-active' : '');

  return (
    <nav>
      <div className="container nav-shell">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <span className="nav-logo-mark">🎓</span>
          <span className="nav-logo-text">
            <strong>Система тестирования</strong>
            <small>Подготовка и результаты</small>
          </span>
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
          {isAuthenticated ? (
            <>
              <li><NavLink to="/tests" className={getLinkClassName} onClick={closeMenu}>Тесты</NavLink></li>
              <li><NavLink to="/results" className={getLinkClassName} onClick={closeMenu}>Мои результаты</NavLink></li>
              <li><NavLink to="/leaderboard" className={getLinkClassName} onClick={closeMenu}>Лидерборд</NavLink></li>
              {user?.role === 'admin' && (
                <li><NavLink to="/admin" className={getLinkClassName} onClick={closeMenu}>Админ панель</NavLink></li>
              )}
              <li className="nav-user-chip">
                <span>{user?.name}</span>
                <small>{user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</small>
              </li>
              <li>
                <button onClick={handleLogout}>Выход</button>
              </li>
            </>
          ) : (
            <>
              <li><NavLink to="/login" className={getLinkClassName} onClick={closeMenu}>Вход</NavLink></li>
              <li><NavLink to="/register" className={getLinkClassName} onClick={closeMenu}>Регистрация</NavLink></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
