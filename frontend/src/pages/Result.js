import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resultService } from '../services/api';

const getPerformanceLabel = (percentage) => {
  if (percentage >= 85) return 'Отличный результат';
  if (percentage >= 70) return 'Хороший результат';
  if (percentage >= 50) return 'Есть база, но стоит повторить';
  return 'Нужно ещё потренироваться';
};

const Result = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResult();
  }, [resultId]);

  const loadResult = async () => {
    try {
      setLoading(true);
      const response = await resultService.getResultById(resultId);
      setResult(response.data);
    } catch (err) {
      setError('Ошибка при загрузке результатов');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="center-content"><div className="spinner"></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!result) return <div className="container mt-4"><div className="alert alert-info">Результат не найден</div></div>;

  const roundedPercentage = Math.round(result.percentage);
  const minutes = Math.floor(result.timeSpent / 60);
  const seconds = result.timeSpent % 60;
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (roundedPercentage / 100) * circumference;

  return (
    <div className="container mt-4">
      <section className="result-hero">
        <div className="card result-score-card">
          <div className="result-score-ring">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" className="result-score-ring-track" />
              <circle
                cx="60"
                cy="60"
                r="52"
                className="result-score-ring-fill"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: dashOffset,
                }}
              />
            </svg>
            <div className="result-score-ring-label">
              <strong>{roundedPercentage}%</strong>
              <span>итог</span>
            </div>
          </div>

          <div className="result-score-copy">
            <span className="page-kicker">Результат готов</span>
            <h1>{getPerformanceLabel(result.percentage)}</h1>
            <p>
              Ты правильно ответил на {result.correctAnswers} из {result.totalQuestions} вопросов.
              Ниже можно посмотреть разбор каждой позиции.
            </p>
          </div>
        </div>

        <div className="result-summary-grid">
          <div className="card metric-card">
            <span>Баллы</span>
            <strong>{result.score}</strong>
          </div>
          <div className="card metric-card">
            <span>Время</span>
            <strong>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</strong>
          </div>
          <div className="card metric-card">
            <span>Тест</span>
            <strong>{result.test?.title || 'Без названия'}</strong>
          </div>
        </div>
      </section>

      <section className="result-review-section">
        <div className="section-heading-row">
          <div>
            <span className="page-kicker">Подробный разбор</span>
            <h2>Ответы по каждому вопросу</h2>
          </div>
          <div className="result-status-pill">
            {result.correctAnswers}/{result.totalQuestions} верно
          </div>
        </div>

        <div className="result-answer-list">
          {result.answers && result.answers.map((answer, idx) => {
            const isCorrect = answer.isCorrect;
            return (
              <article
                key={idx}
                className={`card result-answer-card ${isCorrect ? 'result-answer-card-correct' : 'result-answer-card-wrong'}`}
              >
                <div className="result-answer-top">
                  <div>
                    <span className="result-answer-order">Вопрос {idx + 1}</span>
                    <h3>{answer.questionText}</h3>
                  </div>
                  <div className={`result-answer-badge ${isCorrect ? 'result-answer-badge-correct' : 'result-answer-badge-wrong'}`}>
                    {isCorrect ? 'Верно' : 'Ошибка'}
                  </div>
                </div>

                {!isCorrect && (
                  <div className="result-answer-note">
                    Правильный ответ: вариант {answer.questionId?.correctAnswerIndex + 1 || 'N/A'}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <div className="result-actions">
        <Link to="/tests" className="btn-primary">Выбрать другой тест</Link>
        <Link to="/results" className="btn-secondary">Все мои результаты</Link>
      </div>
    </div>
  );
};

export default Result;
