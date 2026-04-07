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
      setTimeLeft(response.data.timeLimit * 60); // Convert to seconds
      setAnswers(new Array(response.data.questions.length).fill(null));
    } catch (err) {
      setError('Ошибка при загрузке теста');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!testStarted || !test || timeLeft === 0) return;

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
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
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
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

  if (!testStarted) {
    return (
      <div className="center-content">
        <div className="card" style={{ maxWidth: '600px' }}>
          <div className="card-header">{test.title}</div>
          <p><strong>Описание:</strong> {test.description}</p>
          <p><strong>Количество вопросов:</strong> {test.totalQuestions}</p>
          <p><strong>Время на тест:</strong> {test.timeLimit} минут</p>
          <p><strong>Категория:</strong> {test.category}</p>
          
          <div className="alert alert-info">
            📌 <strong>Инструкции:</strong><br/>
            • Вам будут предложены вопросы с четырьмя вариантами ответов<br/>
            • Выбирайте правильный ответ и переходите к следующему<br/>
            • Время ограничено - тест завершится автоматически<br/>
            • Вы сможете просмотреть результаты после завершения
          </div>

          <button 
            onClick={handleStartTest} 
            className="btn-success" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          >
            ▶ Начать тест
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="container mt-4">
      {/* Header with timer */}
      <div style={{ 
        background: '#2c3e50', 
        color: 'white', 
        padding: '1rem', 
        borderRadius: '4px',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, color: 'white' }}>{test.title}</h3>
          <p style={{ margin: '0.5rem 0 0', color: '#ecf0f1' }}>
            Вопрос {currentQuestionIndex + 1} из {test.questions.length}
          </p>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          ⏱ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          background: '#ecf0f1',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#3498db',
            height: '100%',
            width: `${progress}%`,
            transition: 'width 0.3s'
          }}></div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '0.5rem', color: '#7f8c8d' }}>
          {Math.round(progress)}%
        </p>
      </div>

      {/* Question */}
      <div className="card mb-4">
        <div className="card-header">{currentQuestion.text}</div>
        
        <div style={{ marginTop: '1.5rem' }}>
          {currentQuestion.options.map((option, index) => (
            <label key={index} style={{
              display: 'block',
              margin: '1rem 0',
              padding: '1rem',
              border: `2px solid ${answers[currentQuestionIndex] === index ? '#3498db' : '#ecf0f1'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              background: answers[currentQuestionIndex] === index ? '#ebf5fb' : 'white',
              transition: 'all 0.3s'
            }}>
              <input
                type="radio"
                name="answer"
                value={index}
                checked={answers[currentQuestionIndex] === index}
                onChange={() => handleAnswerSelect(index)}
                style={{ marginRight: '0.5rem' }}
              />
              {option.text}
            </label>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <button 
          onClick={handlePrev} 
          className="btn-secondary"
          disabled={currentQuestionIndex === 0}
        >
          ← Предыдущий
        </button>

        {currentQuestionIndex === test.questions.length - 1 ? (
          <button 
            onClick={handleSubmit} 
            className="btn-success"
            disabled={submitting}
          >
            {submitting ? 'Отправка...' : '✓ Завершить тест'}
          </button>
        ) : (
          <button 
            onClick={handleNext} 
            className="btn-primary"
          >
            Следующий →
          </button>
        )}
      </div>

      {/* Questions indicator */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.5rem',
        padding: '1rem',
        background: '#ecf0f1',
        borderRadius: '4px'
      }}>
        {test.questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestionIndex(idx)}
            style={{
              width: '40px',
              height: '40px',
              padding: 0,
              background: 
                idx === currentQuestionIndex ? '#3498db' :
                answers[idx] !== null ? '#27ae60' : 
                '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestTaking;
