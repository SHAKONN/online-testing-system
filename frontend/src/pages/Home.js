import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1>🎓 Online Testing System</h1>
        <p style={{ fontSize: '1.1rem' }}>Система тестирования для подготовки студентов к экзаменам</p>
      </div>

      {!isAuthenticated ? (
        <div className="center-content" style={{ minHeight: '50vh' }}>
          <div className="card" style={{ maxWidth: '600px', textAlign: 'center' }}>
            <h2>Добро пожаловать!</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              Начните тестирование и проверьте свои знания прямо сейчас
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn-primary">Войти</Link>
              <Link to="/register" className="btn-success">Зарегистрироваться</Link>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="mb-3">Начните тестирование</h2>
          <div className="grid grid-3">
            <Link to="/tests" className="card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
              <h3>Выбрать тест</h3>
              <p>Выберите тест по интересующему вас предмету</p>
            </Link>

            <Link to="/results" className="card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <h3>Мои результаты</h3>
              <p>Просмотрите историю своих тестирований</p>
            </Link>

            <Link to="/leaderboard" className="card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
              <h3>Лидерборд</h3>
              <p>Смотрите рейтинг лучших студентов</p>
            </Link>
          </div>

          <div className="card mt-4">
            <h3>📌 Как использовать систему?</h3>
            <ol style={{ paddingLeft: '1.5rem' }}>
              <li>Выберите интересующий вас предмет</li>
              <li>Пройдите тест в отведенное время</li>
              <li>Посмотрите результаты с разбором ответов</li>
              <li>Отслеживайте свой прогресс</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
