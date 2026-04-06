import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resultService } from '../services/api';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await resultService.getUserResults();
      setResults(response.data);
    } catch (err) {
      setError('Ошибка при загрузке результатов');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 70) return '#27ae60';
    if (percentage >= 50) return '#f39c12';
    return '#e74c3c';
  };

  if (loading) return <div className="center-content"><div className="spinner"></div></div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-3">📊 Мои результаты</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {results.length === 0 ? (
        <div className="alert alert-info" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Вы еще не проходили никаких тестов</p>
          <Link to="/tests" className="btn-primary">Начать первый тест</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>{results.length}</h3>
              <p className="text-muted" style={{ margin: 0 }}>Всего тестов</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ 
                margin: '0 0 0.5rem',
                color: getScoreColor(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
              }}>
                {Math.round((results.reduce((sum, r) => sum + r.percentage, 0) / results.length) * 100) / 100}%
              </h3>
              <p className="text-muted" style={{ margin: 0 }}>Средний результат</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>
                {Math.max(...results.map(r => r.percentage)).toFixed(1)}%
              </h3>
              <p className="text-muted" style={{ margin: 0 }}>Лучший результат</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">История тестирований</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '1rem'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Тест</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Категория</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Результат</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Правильно</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Дата</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(result => (
                    <tr key={result._id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                      <td style={{ padding: '0.75rem' }}>{result.test?.title}</td>
                      <td style={{ padding: '0.75rem' }}>{result.category}</td>
                      <td style={{ 
                        padding: '0.75rem', 
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: getScoreColor(result.percentage)
                      }}>
                        {result.percentage.toFixed(1)}%
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        {result.correctAnswers}/{result.totalQuestions}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        {new Date(result.submittedAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <Link to={`/result/${result._id}`} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                          Просмотр
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Results;
