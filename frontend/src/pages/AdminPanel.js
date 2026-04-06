import React, { useState, useEffect } from 'react';
import { testService, questionService, resultService } from '../services/api';

const AdminPanel = () => {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tab === 'dashboard') {
      loadStats();
    }
  }, [tab]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await resultService.getStatistics();
      setStats(response.data);
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">⚙️ Администраторская панель</h1>

      {/* Navigation tabs */}
      <div className="card mb-4">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={tab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setTab('dashboard')}
          >
            📊 Статистика
          </button>
          <button
            className={tab === 'questions' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setTab('questions')}
          >
            ❓ Управление вопросами
          </button>
          <button
            className={tab === 'tests' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setTab('tests')}
          >
            📝 Управление тестами
          </button>
        </div>
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div>
          {loading ? (
            <div className="spinner"></div>
          ) : stats ? (
            <>
              <div className="grid grid-3 mb-4">
                <div className="card" style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: 0, color: '#3498db' }}>{stats.totalUsers}</h3>
                  <p className="text-muted">Пользователей</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: 0, color: '#27ae60' }}>{stats.totalTests}</h3>
                  <p className="text-muted">Активных тестов</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: 0, color: '#9b59b6' }}>{stats.totalResults}</h3>
                  <p className="text-muted">Попыток тестирования</p>
                </div>
              </div>

              {stats.failedQuestions && stats.failedQuestions.length > 0 && (
                <div className="card">
                  <div className="card-header">⚠️ Самые сложные вопросы</div>
                  <div style={{ marginTop: '1rem' }}>
                    {stats.failedQuestions.map((item, idx) => (
                      <div key={idx} style={{
                        padding: '1rem',
                        borderBottom: '1px solid #ecf0f1',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <strong>Вопрос {idx + 1}:</strong> {item.questionText}
                        </div>
                        <div style={{
                          background: '#f8d7da',
                          color: '#721c24',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>
                          {item.failCount} ошибок
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-danger">Ошибка загрузки статистики</div>
          )}
        </div>
      )}

      {/* Questions Management */}
      {tab === 'questions' && (
        <AdminQuestions />
      )}

      {/* Tests Management */}
      {tab === 'tests' && (
        <AdminTests />
      )}
    </div>
  );
};

// ===== ADMIN QUESTIONS COMPONENT =====
const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    category: 'Математика',
    difficulty: 'medium',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    explanation: '',
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionService.getAllQuestions();
      setQuestions(response.data);
    } catch (err) {
      console.error('Ошибка загрузки вопросов:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.text && formData.options.every(o => o.trim())) {
        await questionService.createQuestion(formData);
        setShowForm(false);
        setFormData({
          text: '',
          category: 'Математика',
          difficulty: 'medium',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          explanation: '',
        });
        loadQuestions();
      }
    } catch (err) {
      console.error('Ошибка создания вопроса:', err);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Вы уверены?')) {
      try {
        await questionService.deleteQuestion(questionId);
        loadQuestions();
      } catch (err) {
        console.error('Ошибка удаления:', err);
      }
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-success mb-3">
        {showForm ? '✕ Отмена' : '+ Добавить вопрос'}
      </button>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">Создать новый вопрос</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Текст вопроса</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label>Категория</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Математика</option>
                  <option>Русский язык</option>
                  <option>Физика</option>
                  <option>Химия</option>
                  <option>Биология</option>
                  <option>История</option>
                  <option>География</option>
                  <option>Английский язык</option>
                </select>
              </div>
              <div className="form-group">
                <label>Сложность</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                >
                  <option value="easy">Легкий</option>
                  <option value="medium">Средний</option>
                  <option value="hard">Сложный</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Варианты ответа</label>
              {formData.options.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="radio"
                    name="correct"
                    checked={formData.correctAnswerIndex === idx}
                    onChange={() => setFormData({...formData, correctAnswerIndex: idx})}
                    style={{ marginTop: '0.75rem' }}
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...formData.options];
                      newOpts[idx] = e.target.value;
                      setFormData({...formData, options: newOpts});
                    }}
                    placeholder={`Вариант ${idx + 1}`}
                    style={{ flex: 1 }}
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Объяснение (опционально)</label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({...formData, explanation: e.target.value})}
              />
            </div>

            <button type="submit" className="btn-success">Создать вопрос</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="grid grid-2">
          {questions.map(q => (
            <div key={q._id} className="card">
              <strong>{q.text}</strong>
              <div className="mt-2 text-muted">
                <small>Категория: {q.category} • Сложность: {q.difficulty}</small>
              </div>
              <button
                onClick={() => handleDeleteQuestion(q._id)}
                className="btn-danger mt-2"
                style={{ width: '100%' }}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===== ADMIN TESTS COMPONENT =====
const AdminTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Математика',
    timeLimit: 30,
  });

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await testService.getAllTests();
      setTests(response.data);
    } catch (err) {
      console.error('Ошибка загрузки тестов:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.title && formData.category) {
        await testService.createTest({
          ...formData,
          questionIds: [], // В реальной системе выбираются вопросы
        });
        setShowForm(false);
        loadTests();
      }
    } catch (err) {
      console.error('Ошибка создания теста:', err);
    }
  };

  const handleDeleteTest = async (testId) => {
    if (window.confirm('Вы уверены?')) {
      try {
        await testService.deleteTest(testId);
        loadTests();
      } catch (err) {
        console.error('Ошибка удаления:', err);
      }
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-success mb-3">
        {showForm ? '✕ Отмена' : '+ Добавить тест'}
      </button>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">Создать новый тест</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Название теста</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label>Категория</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Математика</option>
                  <option>Русский язык</option>
                  <option>Физика</option>
                  <option>Химия</option>
                  <option>Биология</option>
                  <option>История</option>
                  <option>География</option>
                  <option>Английский язык</option>
                </select>
              </div>
              <div className="form-group">
                <label>Время на тест (минут)</label>
                <input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value)})}
                  min="5"
                />
              </div>
            </div>

            <button type="submit" className="btn-success">Создать тест</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="grid grid-2">
          {tests.map(test => (
            <div key={test._id} className="card">
              <div className="card-header">{test.title}</div>
              <p>{test.description}</p>
              <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                <strong>Категория:</strong> {test.category}<br/>
                <strong>Вопросов:</strong> {test.questionCount}<br/>
                <strong>Время:</strong> {test.timeLimit} мин
              </div>
              <button
                onClick={() => handleDeleteTest(test._id)}
                className="btn-danger mt-2"
                style={{ width: '100%' }}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
