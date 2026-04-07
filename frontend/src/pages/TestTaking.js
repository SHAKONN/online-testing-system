import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testService, resultService } from '../services/api';

const TestTaking = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTest();
  }, [testId]);

  const loadTest = async () => {
    try {
      setLoading(true);
      const response = await testService.getTestWithQuestions(testId);
      setTest(response.data);
      setTimeLeft(response.data.timeLimit * 60);
      setAnswers(new Array(response.data.questions.length).fill(null));
    } catch (err) {
      setError('Ошибка при загрузке теста');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!testStarted || !test) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, test, timeLeft]);

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleAnswerSelect = (optionIndex) => {
    setAnswers((prev) => {
      const nextAnswers = [...prev];
      nextAnswers[currentQuestionIndex] = optionIndex;
      return nextAnswers;
    });
  };

  const handleQuestionJump = (index) => {
    setCurrentQuestionIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!test) return;

    try {
      setSubmitting(true);
      const testAnswers = answers.map((answerIndex, idx) => ({
        questionId: test.questions[idx]._id,
        selectedAnswerIndex: answerIndex,
      }));

      const timeSpent = (test.timeLimit * 60) - timeLeft;
      const response = await resultService.submitTest(testId, testAnswers, timeSpent);
      navigate(`/result/${response.data.result._id}`);
    } catch (err) {
      setError('Ошибка при отправке результатов');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="center-content"><div className="spinner"></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!test) return <div className="container mt-4"><div className="alert alert-info">Тест не найден</div></div>;
  if (!Array.isArray(test.questions) || test.questions.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          В этом тесте пока нет вопросов. Вернитесь позже или попросите администратора заполнить тест.
        </div>
      </div>
    );
  }

  const answeredCount = answers.filter((answer) => answer !== null).length;
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!testStarted) {
    return (
      <div className="container mt-4">
        <section className="test-intro-layout">
          <div className="test-intro-main card">
            <span className="page-kicker">Готов к запуску</span>
            <h1>{test.title}</h1>
            <p className="test-intro-description">
              {test.description || 'Тест без описания. Ниже собрана ключевая информация перед стартом.'}
            </p>

            <div className="test-intro-summary">
              <div>
                <span>Категория</span>
                <strong>{test.category}</strong>
              </div>
              <div>
                <span>Вопросов</span>
                <strong>{test.totalQuestions}</strong>
              </div>
              <div>
                <span>Лимит времени</span>
                <strong>{test.timeLimit} минут</strong>
              </div>
            </div>

            <button onClick={handleStartTest} className="btn-success test-intro-action">
              Начать тест
            </button>
          </div>

          <aside className="test-intro-side card">
            <h2>Как всё пройдёт</h2>
            <ul className="check-list">
              <li>В каждом вопросе один правильный ответ.</li>
              <li>Можно свободно переключаться между вопросами до отправки.</li>
              <li>Таймер идёт непрерывно и завершит тест автоматически.</li>
              <li>После завершения ты увидишь процент, правильные ответы и разбор.</li>
            </ul>
          </aside>
        </section>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div className="container mt-4">
      <section className="test-session-shell">
        <div className="test-session-main">
          <div className="test-session-header">
            <div>
              <span className="page-kicker">Прохождение теста</span>
              <h1>{test.title}</h1>
              <p>
                Вопрос {currentQuestionIndex + 1} из {test.questions.length}
              </p>
            </div>
            <div className={`test-session-timer ${timeLeft <= 60 ? 'test-session-timer-danger' : ''}`}>
              <span>Осталось</span>
              <strong>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</strong>
            </div>
          </div>

          <div className="test-session-progress">
            <div className="test-session-progress-bar">
              <div className="test-session-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="test-session-progress-meta">
              <span>{answeredCount} из {test.questions.length} уже отмечены</span>
              <span>{Math.round(progress)}% маршрута пройдено</span>
            </div>
          </div>

          <article className="card question-stage-card">
            <div className="question-stage-topline">
              <span className="question-order-chip">Вопрос {currentQuestionIndex + 1}</span>
              <span className="question-category-chip">{test.category}</span>
            </div>

            <h2 className="question-stage-title">{currentQuestion.text}</h2>

            <div className="question-options-stack">
              {currentQuestion.options.map((option, index) => {
                const selected = answers[currentQuestionIndex] === index;
                return (
                  <button
                    key={index}
                    type="button"
                    className={`question-option-button ${selected ? 'question-option-button-selected' : ''}`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <span className="question-option-marker">{String.fromCharCode(65 + index)}</span>
                    <span className="question-option-text">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </article>

          <div className="test-session-actions">
            <button onClick={handlePrev} className="btn-secondary" disabled={currentQuestionIndex === 0}>
              Предыдущий
            </button>

            {currentQuestionIndex === test.questions.length - 1 ? (
              <button onClick={handleSubmit} className="btn-success" disabled={submitting}>
                {submitting ? 'Отправка...' : 'Завершить тест'}
              </button>
            ) : (
              <button onClick={handleNext} className="btn-primary">
                Следующий вопрос
              </button>
            )}
          </div>
        </div>

        <aside className="test-session-sidebar card">
          <div className="test-session-sidebar-head">
            <h3>Навигация</h3>
            <p className="text-muted">Серые не отвечены, синие активны, зелёные заполнены.</p>
          </div>

          <div className="question-dot-grid">
            {test.questions.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={[
                  'question-dot',
                  idx === currentQuestionIndex ? 'question-dot-current' : '',
                  answers[idx] !== null ? 'question-dot-answered' : '',
                ].join(' ').trim()}
                onClick={() => handleQuestionJump(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="test-session-sidebar-summary">
            <div>
              <span>Отвечено</span>
              <strong>{answeredCount}</strong>
            </div>
            <div>
              <span>Осталось</span>
              <strong>{test.questions.length - answeredCount}</strong>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default TestTaking;
