import React, { useState, useEffect, useRef } from 'react';
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
      <h1 className="mb-4 admin-panel-title">⚙️ Администраторская панель</h1>

      {/* Navigation tabs */}
      <div className="card mb-4">
        <div className="admin-tabs" style={{ display: 'flex', gap: '0.5rem' }}>
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
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
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
      setSubmitError('');
      setSubmitSuccess('');

      if (!formData.text.trim()) {
        setSubmitError('Введите текст вопроса');
        return;
      }

      if (!formData.options.every(o => o.trim())) {
        setSubmitError('Заполните все 4 варианта ответа');
        return;
      }

      await questionService.createQuestion({
        ...formData,
        text: formData.text.trim(),
        options: formData.options.map((option) => option.trim()),
        explanation: formData.explanation.trim(),
      });

      setShowForm(false);
      setSubmitSuccess('Вопрос успешно создан');
      setFormData({
        text: '',
        category: 'Математика',
        difficulty: 'medium',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
      });
      loadQuestions();
    } catch (err) {
      console.error('Ошибка создания вопроса:', err);
      setSubmitError(err.response?.data?.message || 'Не удалось создать вопрос');
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
          {submitError && (
            <div className="alert alert-danger mt-2">{submitError}</div>
          )}
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
                <div
                  key={idx}
                  className="answer-option-row"
                  style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}
                >
                  <input
                    type="radio"
                    name="correct"
                    checked={formData.correctAnswerIndex === idx}
                    onChange={() => setFormData({...formData, correctAnswerIndex: idx})}
                    className="answer-option-radio"
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
                    className="answer-option-input"
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

      {!showForm && submitSuccess && (
        <div className="alert alert-success mb-3">{submitSuccess}</div>
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
  const [editingTestId, setEditingTestId] = useState(null);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [generationCount, setGenerationCount] = useState(5);
  const formCardRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Математика',
    timeLimit: 30,
    questions: [
      {
        text: '',
        difficulty: 'medium',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
      },
    ],
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

  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
    setSubmitError('');
    setSubmitSuccess('');
  };

  const updateQuestionField = (questionIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex
          ? { ...question, [field]: value }
          : question
      ),
    }));
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) => {
        if (index !== questionIndex) {
          return question;
        }

        const nextOptions = [...question.options];
        nextOptions[optionIndex] = value;

        return {
          ...question,
          options: nextOptions,
        };
      }),
    }));
  };

  const addQuestionBlock = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          difficulty: 'medium',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          explanation: '',
        },
      ],
    }));
  };

  const duplicateQuestionBlock = (questionIndex) => {
    setFormData((prev) => {
      const sourceQuestion = prev.questions[questionIndex];
      const duplicatedQuestion = {
        text: sourceQuestion.text,
        difficulty: sourceQuestion.difficulty,
        options: [...sourceQuestion.options],
        correctAnswerIndex: sourceQuestion.correctAnswerIndex,
        explanation: sourceQuestion.explanation,
      };

      return {
        ...prev,
        questions: [
          ...prev.questions.slice(0, questionIndex + 1),
          duplicatedQuestion,
          ...prev.questions.slice(questionIndex + 1),
        ],
      };
    });
  };

  const removeQuestionBlock = (questionIndex) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex),
    }));
  };

  const resetForm = () => {
    setEditingTestId(null);
    setFormData({
      title: '',
      description: '',
      category: 'Математика',
      timeLimit: 30,
      questions: [
        {
          text: '',
          difficulty: 'medium',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          explanation: '',
        },
      ],
    });
  };

  const handleEditTest = async (testId) => {
    try {
      setSubmitError('');
      setSubmitSuccess('');
      const response = await testService.getTestById(testId);
      const test = response.data;

      setEditingTestId(test._id);
      setShowForm(true);
      setFormData({
        title: test.title || '',
        description: test.description || '',
        category: test.category || 'Математика',
        timeLimit: test.timeLimit || 30,
        questions: Array.isArray(test.questions) && test.questions.length > 0
          ? test.questions.map((question) => ({
              _id: question._id,
              text: question.text || '',
              difficulty: question.difficulty || 'medium',
              options: Array.isArray(question.options)
                ? question.options.map((option) => option.text || '')
                : ['', '', '', ''],
              correctAnswerIndex: Number.isInteger(question.correctAnswerIndex) ? question.correctAnswerIndex : 0,
              explanation: question.explanation || '',
            }))
          : [
              {
                text: '',
                difficulty: 'medium',
                options: ['', '', '', ''],
                correctAnswerIndex: 0,
                explanation: '',
              },
            ],
      });

      setTimeout(() => {
        formCardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 0);
    } catch (err) {
      console.error('Ошибка загрузки теста для редактирования:', err);
      setSubmitError(err.response?.data?.message || 'Не удалось загрузить тест для редактирования');
    }
  };

  const handleGenerateQuestions = async () => {
    try {
      setSubmitError('');
      setSubmitSuccess('');
      setGeneratingQuestions(true);

      const response = await testService.generateQuestions({
        category: formData.category,
        count: generationCount,
      });

      const generatedQuestions = response.data.questions.map((question) => ({
        text: question.text || '',
        difficulty: question.difficulty || 'medium',
        options: Array.isArray(question.options) ? question.options : ['', '', '', ''],
        correctAnswerIndex: Number.isInteger(question.correctAnswerIndex) ? question.correctAnswerIndex : 0,
        explanation: question.explanation || '',
      }));

      setFormData((prev) => ({
        ...prev,
        questions: generatedQuestions,
      }));
      setSubmitSuccess('Вопросы сгенерированы. Проверьте их и при необходимости отредактируйте перед сохранением.');
    } catch (err) {
      console.error('Ошибка генерации вопросов:', err);
      setSubmitError(err.response?.data?.message || 'Не удалось сгенерировать вопросы');
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitError('');
      setSubmitSuccess('');

      if (!formData.title.trim()) {
        setSubmitError('Введите название теста');
        return;
      }

      if (formData.questions.length === 0) {
        setSubmitError('Добавьте хотя бы один вопрос');
        return;
      }

      const invalidQuestionIndex = formData.questions.findIndex((question) => {
        if (!question.text.trim()) {
          return true;
        }

        if (!question.options.every((option) => option.trim())) {
          return true;
        }

        return false;
      });

      if (invalidQuestionIndex !== -1) {
        setSubmitError(`Заполните полностью вопрос ${invalidQuestionIndex + 1}`);
        return;
      }

      if (formData.title && formData.category) {
        const payload = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          timeLimit: formData.timeLimit,
          questions: formData.questions.map((question) => ({
            ...(question._id ? { _id: question._id } : {}),
            text: question.text.trim(),
            difficulty: question.difficulty,
            options: question.options.map((option) => option.trim()),
            correctAnswerIndex: question.correctAnswerIndex,
            explanation: question.explanation.trim(),
          })),
        };

        if (editingTestId) {
          await testService.updateTest(editingTestId, payload);
        } else {
          await testService.createTest(payload);
        }
        setShowForm(false);
        setSubmitSuccess(editingTestId ? 'Тест успешно обновлен' : 'Тест успешно создан');
        resetForm();
        loadTests();
      }
    } catch (err) {
      console.error('Ошибка создания теста:', err);
      setSubmitError(err.response?.data?.message || 'Не удалось создать тест');
    }
  };

  const handleDeleteTest = async (testId) => {
    try {
      setTests((prev) => prev.filter((test) => test._id !== testId));
      await testService.deleteTest(testId);
    } catch (err) {
      console.error('Ошибка удаления:', err);
      setSubmitError(err.response?.data?.message || 'Не удалось удалить тест');
      loadTests();
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          if (showForm) {
            setShowForm(false);
            resetForm();
          } else {
            setShowForm(true);
            resetForm();
          }
        }}
        className="btn-success mb-3"
      >
        {showForm ? '✕ Отмена' : '+ Добавить тест'}
      </button>

      {showForm && (
        <div ref={formCardRef} className="card mb-4">
          <div className="card-header">
            {editingTestId ? 'Редактировать тест' : 'Создать новый тест'}
          </div>
          {submitError && (
            <div className="alert alert-danger mt-2">{submitError}</div>
          )}
          <div className="alert alert-info mt-2">
            Сначала заполните данные теста, затем создайте новые вопросы прямо в этой форме.
          </div>
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
                  onChange={(e) => handleCategoryChange(e.target.value)}
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

            <div className="form-group">
              <div className="question-builder-header">
                <label style={{ marginBottom: 0 }}>Вопросы для теста</label>
                <div className="question-builder-top-actions">
                  <div className="ai-generate-controls">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={generationCount}
                      onChange={(e) => setGenerationCount(Number(e.target.value) || 1)}
                    />
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleGenerateQuestions}
                      disabled={generatingQuestions}
                    >
                      {generatingQuestions ? 'Генерация...' : 'Сгенерировать с ИИ'}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={addQuestionBlock}
                  >
                    + Добавить вопрос
                  </button>
                </div>
              </div>
              <div className="question-picker-toolbar mb-2">
                <div className="question-picker-count">
                  Вопросов в тесте: <strong>{formData.questions.length}</strong>
                </div>
              </div>
              <div className="test-builder-stack">
                {formData.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="test-builder-question-card">
                    <div className="test-builder-question-head">
                      <div>
                        <h3>Вопрос {questionIndex + 1}</h3>
                        <div className="text-muted">Категория: {formData.category}</div>
                      </div>
                      <div className="test-builder-question-buttons">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => duplicateQuestionBlock(questionIndex)}
                        >
                          Дублировать
                        </button>
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={() => removeQuestionBlock(questionIndex)}
                          disabled={formData.questions.length === 1}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Текст вопроса</label>
                      <textarea
                        value={question.text}
                        onChange={(e) => updateQuestionField(questionIndex, 'text', e.target.value)}
                        placeholder="Введите текст вопроса"
                      />
                    </div>

                    <div className="grid grid-2">
                      <div className="form-group">
                        <label>Сложность</label>
                        <select
                          value={question.difficulty}
                          onChange={(e) => updateQuestionField(questionIndex, 'difficulty', e.target.value)}
                        >
                          <option value="easy">Легкий</option>
                          <option value="medium">Средний</option>
                          <option value="hard">Сложный</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Варианты ответа</label>
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="answer-option-row"
                          style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}
                        >
                          <input
                            type="radio"
                            name={`test-question-correct-${questionIndex}`}
                            checked={question.correctAnswerIndex === optionIndex}
                            onChange={() => updateQuestionField(questionIndex, 'correctAnswerIndex', optionIndex)}
                            className="answer-option-radio"
                            style={{ marginTop: '0.75rem' }}
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateQuestionOption(questionIndex, optionIndex, e.target.value)}
                            placeholder={`Вариант ${optionIndex + 1}`}
                            className="answer-option-input"
                            style={{ flex: 1 }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="form-group">
                      <label>Объяснение (опционально)</label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestionField(questionIndex, 'explanation', e.target.value)}
                        placeholder="Краткое объяснение правильного ответа"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-success">
              {editingTestId ? 'Сохранить изменения' : 'Создать тест'}
            </button>
          </form>
        </div>
      )}

      {!showForm && submitSuccess && (
        <div className="alert alert-success mb-3">{submitSuccess}</div>
      )}

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="grid grid-2">
          {tests.map(test => (
            <div key={test._id} className="card admin-test-card">
              <div className="card-header">{test.title}</div>
              <p className="admin-test-description">
                {test.description || 'Описание не указано'}
              </p>
              <div className="admin-test-meta">
                <div><strong>Категория:</strong> {test.category}</div>
                <div><strong>Вопросов:</strong> {test.questionCount}</div>
                <div><strong>Время:</strong> {test.timeLimit} мин</div>
              </div>
              <button
                onClick={() => handleEditTest(test._id)}
                className="btn-primary mt-2 admin-test-edit"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDeleteTest(test._id)}
                className="btn-danger mt-2 admin-test-delete"
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
