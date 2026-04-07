import React, { useState, useEffect } from 'react';
import { resultService } from '../services/api';

const getMedalLabel = (position) => {
  if (position === 1) return 'Лидер';
  if (position === 2) return 'Сильный результат';
  if (position === 3) return 'В топе';
  return '';
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await resultService.getLeaderboard();
      setLeaderboard(response.data);
    } catch (err) {
      setError('Ошибка при загрузке лидерборда');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="center-content"><div className="spinner"></div></div>;

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="container mt-4">
      <section className="page-hero leaderboard-hero">
        <div className="page-hero-copy">
          <span className="page-kicker">Рейтинг пользователей</span>
          <h1>Лидерборд по среднему результату</h1>
          <p>
            Сравни свои результаты с другими участниками и смотри, кто стабильно держит высокий
            уровень по всем тестам.
          </p>
        </div>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}

      {leaderboard.length === 0 ? (
        <div className="empty-state-card">
          <h2>Лидерборд пока пуст</h2>
          <p>Как только пользователи начнут проходить тесты, здесь появится рейтинг.</p>
        </div>
      ) : (
        <>
          <section className="leaderboard-podium">
            {topThree.map((user, index) => (
              <article key={user._id} className={`card podium-card podium-card-${index + 1}`}>
                <span className="podium-rank">#{index + 1}</span>
                <h3>{user.name}</h3>
                <p>{getMedalLabel(index + 1)}</p>
                <strong>{user.averageScore.toFixed(1)}%</strong>
                <span>{user.totalTests} тестов завершено</span>
              </article>
            ))}
          </section>

          <section className="card panel-card">
            <div className="panel-card-header">
              <div>
                <h2>Полная таблица</h2>
                <p className="text-muted">Список участников с баллами и количеством тестов.</p>
              </div>
            </div>

            <div className="leaderboard-list">
              {leaderboard.map((user, idx) => (
                <article key={user._id} className="leaderboard-row">
                  <div className="leaderboard-rank-block">#{idx + 1}</div>
                  <div className="leaderboard-user-block">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                  <div className="leaderboard-stat-block">
                    <span>Тестов</span>
                    <strong>{user.totalTests}</strong>
                  </div>
                  <div className="leaderboard-stat-block">
                    <span>Средний результат</span>
                    <strong className={user.averageScore >= 70 ? 'score-good' : user.averageScore >= 50 ? 'score-medium' : 'score-low'}>
                      {user.averageScore.toFixed(1)}%
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
