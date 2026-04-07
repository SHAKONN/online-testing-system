import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { testService } from '../services/api';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Математика',
    'Русский язык',
    'Физика',
    'Химия',
    'Биология',
    'История',
    'География',
    'Английский язык',
  ];

  useEffect(() => {
    loadTests();
  }, [selectedCategory]);

  const loadTests = async () => {
    try {
      setLoading(true);
      setError('');
      let response;
      if (selectedCategory) {
        response = await testService.getTestsByCategory(selectedCategory);
      } else {
        response = await testService.getAllTests();
      }
      setTests(response.data);
    } catch (err) {
      setError('Ошибка при загрузке тестов');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-3">📝 Доступные тесты</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Фильтр по категориям */}
      <div className="card mb-4">
        <h3>Фильтр по категориям:</h3>
        <div className="category-filter-list">
          <button
            className={selectedCategory === '' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setSelectedCategory('')}
          >
            Все
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : tests.length > 0 ? (
        <div className="grid grid-2">
          {tests.map(test => (
            <div key={test._id} className="card">
              <div className="card-header">{test.title}</div>
              <p>{test.description}</p>
              <div className="mb-2 test-card-meta">
                <strong>Категория:</strong> {test.category}<br/>
                <strong>Вопросов:</strong> {test.questionCount}<br/>
                <strong>Время:</strong> {test.timeLimit} минут<br/>
                <strong>Попыток:</strong> {test.totalAttempts}<br/>
                {test.averageScore > 0 && (
                  <><strong>Средний балл:</strong> {Math.round(test.averageScore)}%</>
                )}
              </div>
              <Link to={`/test/${test._id}`} className="btn-primary test-card-action">
                Начать тест
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info" style={{ textAlign: 'center' }}>
          Тесты в этой категории не найдены
        </div>
      )}
    </div>
  );
};

export default Tests;
