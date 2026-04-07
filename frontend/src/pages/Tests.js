import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { testService } from '../services/api';

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

const categoryAccents = {
  Математика: 'category-accent-math',
  'Русский язык': 'category-accent-language',
  Физика: 'category-accent-science',
  Химия: 'category-accent-chemistry',
  Биология: 'category-accent-biology',
  История: 'category-accent-history',
  География: 'category-accent-geo',
  'Английский язык': 'category-accent-english',
};

const formatAverage = (value) => {
  if (!value) return 'Новых попыток пока нет';
  return `${Math.round(value)}% средний результат`;
};

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadTests();
  }, [selectedCategory]);

  const loadTests = async () => {
    try {
      setLoading(true);
      setError('');
      const response = selectedCategory
        ? await testService.getTestsByCategory(selectedCategory)
        : await testService.getAllTests();

      setTests(response.data);
    } catch (err) {
      setError('Ошибка при загрузке тестов');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalAttempts = tests.reduce((sum, test) => sum + (test.totalAttempts || 0), 0);
  const averageQuestionCount = tests.length > 0
    ? Math.round(tests.reduce((sum, test) => sum + (test.questionCount || 0), 0) / tests.length)
    : 0;

  return (
    <div className="container mt-4">
      <section className="page-hero tests-hero">
        <div className="page-hero-copy">
          <span className="page-kicker">Каталог тестов</span>
          <h1>Подготовка по предметам в одном месте</h1>
          <p>
            Выбирай нужную категорию, отслеживай свои прошлые попытки и запускай тест с понятным
            таймером и разбором ответов после завершения.
          </p>
        </div>
        <div className="page-hero-stats">
          <div className="hero-stat-card">
            <strong>{tests.length}</strong>
            <span>доступных тестов</span>
          </div>
          <div className="hero-stat-card">
            <strong>{totalAttempts}</strong>
            <span>попыток уже выполнено</span>
          </div>
          <div className="hero-stat-card">
            <strong>{averageQuestionCount || 0}</strong>
            <span>вопросов в среднем</span>
          </div>
        </div>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="card panel-card mb-4">
        <div className="panel-card-header">
          <div>
            <h2>Фильтр по категориям</h2>
            <p className="text-muted">Быстрый переход к нужному предмету без лишнего поиска.</p>
          </div>
          {selectedCategory && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setSelectedCategory('')}
            >
              Сбросить фильтр
            </button>
          )}
        </div>

        <div className="category-pill-list">
          <button
            className={selectedCategory === '' ? 'btn-primary category-pill' : 'btn-secondary category-pill'}
            onClick={() => setSelectedCategory('')}
          >
            Все тесты
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? 'btn-primary category-pill' : 'btn-secondary category-pill'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="center-content"><div className="spinner"></div></div>
      ) : tests.length > 0 ? (
        <section className="test-card-grid">
          {tests.map((test) => {
            const accentClass = categoryAccents[test.category] || 'category-accent-default';
            return (
              <article key={test._id} className={`test-showcase-card ${accentClass}`}>
                <div className="test-showcase-head">
                  <span className="test-category-badge">{test.category}</span>
                  <span className="test-attempts-badge">
                    {test.totalAttempts > 0 ? `${test.totalAttempts} попыток` : 'Новый тест'}
                  </span>
                </div>

                <h3>{test.title}</h3>
                <p className="test-showcase-description">
                  {test.description || 'Описание пока не добавлено, но тест уже доступен для прохождения.'}
                </p>

                <div className="test-showcase-metrics">
                  <div>
                    <span>Вопросы</span>
                    <strong>{test.questionCount}</strong>
                  </div>
                  <div>
                    <span>Время</span>
                    <strong>{test.timeLimit} мин</strong>
                  </div>
                  <div>
                    <span>Успеваемость</span>
                    <strong>{test.averageScore ? `${Math.round(test.averageScore)}%` : 'Н/Д'}</strong>
                  </div>
                </div>

                <div className="test-showcase-progress">
                  <div className="test-showcase-progress-bar">
                    <div
                      className="test-showcase-progress-fill"
                      style={{ width: `${Math.max(8, Math.round(test.averageScore || 8))}%` }}
                    ></div>
                  </div>
                  <span>{formatAverage(test.averageScore)}</span>
                </div>

                <Link to={`/test/${test._id}`} className="btn-primary test-showcase-action">
                  Начать тест
                </Link>
              </article>
            );
          })}
        </section>
      ) : (
        <div className="empty-state-card">
          <h2>Тесты пока не найдены</h2>
          <p>
            Для выбранной категории ещё нет доступных тестов. Попробуй другой предмет или зайди позже.
          </p>
          <button type="button" className="btn-primary" onClick={() => setSelectedCategory('')}>
            Показать все тесты
          </button>
        </div>
      )}
    </div>
  );
};

export default Tests;
