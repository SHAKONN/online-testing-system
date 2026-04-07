import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resultService } from '../services/api';

const getScoreColorClass = (percentage) => {
  if (percentage >= 70) return 'score-good';
  if (percentage >= 50) return 'score-medium';
  return 'score-low';
};

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

  if (loading) return <div className="center-content"><div className="spinner"></div></div>;

  const averagePercentage = results.length
    ? Math.round((results.reduce((sum, result) => sum + result.percentage, 0) / results.length) * 10) / 10
    : 0;
  const bestPercentage = results.length
    ? Math.max(...results.map((result) => result.percentage)).toFixed(1)
    : 0;

  return (
    <div className="container mt-4">
      <section className="page-hero results-hero">
        <div className="page-hero-copy">
          <span className="page-kicker">Твоя статистика</span>
          <h1>Мои результаты и история тестирований</h1>
          <p>
            Здесь собраны все попытки, текущая средняя успеваемость и быстрый доступ к подробному
            разбору каждого завершённого теста.
          </p>
        </div>

        <div className="page-hero-stats">
          <div className="hero-stat-card">
            <strong>{results.length}</strong>
            <span>всего попыток</span>
          </div>
          <div className="hero-stat-card">
            <strong>{averagePercentage}%</strong>
            <span>средний результат</span>
          </div>
          <div className="hero-stat-card">
            <strong>{bestPercentage}%</strong>
            <span>лучший результат</span>
          </div>
        </div>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}

      {results.length === 0 ? (
        <div className="empty-state-card">
          <h2>История пока пустая</h2>
          <p>Как только ты завершишь первый тест, здесь появятся баллы, даты и подробный разбор.</p>
          <Link to="/tests" className="btn-primary">Начать первый тест</Link>
        </div>
      ) : (
        <>
          <section className="result-overview-grid mb-4">
            <div className="card metric-card">
              <span>Пройдено тестов</span>
              <strong>{results.length}</strong>
            </div>
            <div className="card metric-card">
              <span>Средний балл</span>
              <strong className={getScoreColorClass(averagePercentage)}>{averagePercentage}%</strong>
            </div>
            <div className="card metric-card">
              <span>Лучший результат</span>
              <strong className={getScoreColorClass(Number(bestPercentage))}>{bestPercentage}%</strong>
            </div>
          </section>

          <section className="card panel-card">
            <div className="panel-card-header">
              <div>
                <h2>История тестирований</h2>
                <p className="text-muted">Все попытки в одном списке с быстрым переходом к деталям.</p>
              </div>
            </div>

            <div className="result-history-list">
              {results.map((result) => (
                <article key={result._id} className="result-history-row">
                  <div className="result-history-main">
                    <h3>{result.test?.title || 'Тест без названия'}</h3>
                    <p>{result.category}</p>
                  </div>

                  <div className="result-history-meta">
                    <div>
                      <span>Результат</span>
                      <strong className={getScoreColorClass(result.percentage)}>
                        {result.percentage.toFixed(1)}%
                      </strong>
                    </div>
                    <div>
                      <span>Верно</span>
                      <strong>{result.correctAnswers}/{result.totalQuestions}</strong>
                    </div>
                    <div>
                      <span>Дата</span>
                      <strong>{new Date(result.submittedAt).toLocaleDateString('ru-RU')}</strong>
                    </div>
                  </div>

                  <Link to={`/result/${result._id}`} className="btn-primary result-history-action">
                    Открыть разбор
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Results;
