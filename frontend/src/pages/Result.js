import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resultService } from '../services/api';

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

  const scoreColor = result.percentage >= 70 ? '#27ae60' : result.percentage >= 50 ? '#f39c12' : '#e74c3c';
  const minutes = Math.floor(result.timeSpent / 60);
  const seconds = result.timeSpent % 60;

  return (
    <div className="container mt-4">
      {/* Score Summary */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>✓ Тест завершен!</h2>
        <div style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: scoreColor,
          margin: '1rem 0',
          textShadow: `0 0 10px ${scoreColor}40`
        }}>
          {Math.round(result.percentage)}%
        </div>
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          <strong>Правильные ответы:</strong> {result.correctAnswers} из {result.totalQuestions}
        </div>
        <div className="grid grid-3" style={{ gap: '1rem', marginTop: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>{result.score}</div>
            <div className="text-muted">Baллов</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-muted">Затрачено времени</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#9b59b6' }}>
              {result.test?.title}
            </div>
            <div className="text-muted">Категория</div>
          </div>
        </div>
      </div>

      {/* Answers Review */}
      <h2 className="mb-3">📋 Разбор ответов</h2>
      
      {result.answers && result.answers.map((answer, idx) => {
        const isCorrect = answer.isCorrect;
        return (
          <div 
            key={idx} 
            className="card" 
            style={{ 
              marginBottom: '1.5rem',
              borderLeft: `4px solid ${isCorrect ? '#27ae60' : '#e74c3c'}`
            }}
          >
            <div className="result-answer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Вопрос {idx + 1}: {answer.questionText}
                </div>
                
                {isCorrect ? (
                  <div className="alert alert-success" style={{ margin: '0.5rem 0', padding: '0.75rem' }}>
                    ✓ Правильно!
                  </div>
                ) : (
                  <div className="alert alert-danger" style={{ margin: '0.5rem 0', padding: '0.75rem' }}>
                    ✗ Неправильно
                  </div>
                )}
              </div>
              <div style={{ marginLeft: '1rem', minWidth: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>
                  {isCorrect ? '✓' : '✗'}
                </div>
              </div>
            </div>

            {!isCorrect && (
              <div className="alert alert-info" style={{ marginTop: '1rem' }}>
                <strong>Правильный ответ:</strong> Вариант {answer.questionId?.correctAnswerIndex + 1 || 'N/A'}
              </div>
            )}
          </div>
        );
      })}

      {/* Action buttons */}
      <div className="result-actions" style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginTop: '2rem',
        justifyContent: 'center'
      }}>
        <Link to="/tests" className="btn-primary">
          Выбрать другой тест
        </Link>
        <Link to="/results" className="btn-secondary">
          Мои результаты
        </Link>
      </div>
    </div>
  );
};

export default Result;
