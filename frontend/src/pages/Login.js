import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.email || !formData.password) {
      setValidationError('Заполните все поля');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/tests');
    } catch (err) {
      console.error('Ошибка входа:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-content">
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header">Вход в систему</div>
        
        {(error || validationError) && (
          <div className="alert alert-danger">
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ваш пароль"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="text-center mt-3">
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
        </p>

        <div className="alert alert-info mt-3" style={{ fontSize: '0.9rem' }}>
          <strong>Тестовые аккаунты:</strong><br/>
          Admin: admin@example.com / admin123<br/>
          User: user1@example.com / password123
        </div>
      </div>
    </div>
  );
};

export default Login;
