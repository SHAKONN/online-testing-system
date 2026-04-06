import React, { useState, useEffect } from 'react';
import { resultService } from '../services/api';

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

  const getMedalEmoji = (position) => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  if (loading) return <div className="center-content"><div className="spinner"></div></div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">🏆 Лидерборд</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {leaderboard.length === 0 ? (
        <div className="alert alert-info" style={{ textAlign: 'center' }}>
          Лидерборд пока пуст
        </div>
      ) : (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ecf0f1', background: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Место</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Пользователь</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Тестов пройдено</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Средний результат</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, idx) => (
                  <tr 
                    key={user._id} 
                    style={{ 
                      borderBottom: '1px solid #ecf0f1',
                      background: idx < 3 ? '#f0f8ff' : 'white'
                    }}
                  >
                    <td style={{ 
                      padding: '1rem', 
                      fontWeight: 'bold', 
                      fontSize: '1.2rem',
                      textAlign: 'center',
                      color: idx < 3 ? '#f39c12' : '#7f8c8d'
                    }}>
                      {getMedalEmoji(idx + 1)} {idx + 1}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <strong>{user.name}</strong><br/>
                      <span className="text-muted">{user.email}</span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {user.totalTests}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: user.averageScore >= 70 ? '#27ae60' : user.averageScore >= 50 ? '#f39c12' : '#e74c3c'
                    }}>
                      {user.averageScore.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
