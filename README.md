# 🎓 Online Testing System - Система тестирования университета

Полнофункциональная веб-приложение для онлайн-тестирования студентов с поддержкой администраторской панели, отслеживанием прогресса и лидербордом.

---

## 📋 Содержание

- [Функции](#-функции)
- [Технический стек](#-технический-стек)
- [Требования](#-требования)
- [Установка](#-установка)
- [Запуск проекта](#-запуск-проекта)
- [API Documentation](#-api-документация)
- [Тестовые аккаунты](#-тестовые-аккаунты)
- [Структура проекта](#-структура-проекта)
- [Дальнейшее развитие](#-дальнейшее-развитие)

---

## ✨ Функции

### 👤 Для пользователей:
- ✅ Регистрация и вход (JWT авторизация)
- ✅ Выбор теста по категориям (8 предметов)
- ✅ Прохождение тестов с таймером
- ✅ Просмотр результатов с разбором ответов
- ✅ Отслеживание прогресса и статистики
- ✅ Просмотр лидерборда и рейтинга

### 🛠 Для администраторов:
- ✅ Создание/редактирование/удаление тестов
- ✅ Управление вопросами (CRUD операции)
- ✅ Просмотр аналитики и статистики
- ✅ Отслеживание ошибок пользователей
- ✅ Управление категориями и сложностями

---

## 💻 Технический стек

### Backend:
- **Node.js + Express** - REST API сервер
- **MongoDB** - База данных
- **Mongoose** - ODM для MongoDB
- **JWT** - Аутентификация
- **bcryptjs** - Шифрование паролей
- **CORS** - Кросс-доменные запросы

### Frontend:
- **React 18** - UI библиотека
- **React Router v6** - Маршрутизация
- **Axios** - HTTP клиент
- **CSS3** - Стилизация
- **Context API** - Управление состоянием

### Database:
- **MongoDB** (локально или MongoDB Atlas)

---

## 📦 Требования

Убедитесь, что установлены:
- **Node.js** (v14+ или новее)
- **npm** (обычно идет с Node.js)
- **MongoDB** (установлен локально или используется MongoDB Atlas)

Проверить версии:
```bash
node --version
npm --version
```

---

## 🚀 Установка

### 1. Клонируем/создаем проект

```bash
cd /path/to/diploma
```

Проект уже должен быть структурирован следующим образом:
```
online-testing-system/
├── backend/
├── frontend/
└── README.md
```

### 2. Установка зависимостей Backend

```bash
cd backend
npm install
```

### 3. Установка зависимостей Frontend

```bash
cd ../frontend
npm install
```

### 4. Настройка переменных окружения

#### Backend (.env файл):

```bash
cd ../backend
cp .env.example .env
```

Отредактируйте `backend/.env`:
```env
# ===== DATABASE =====
MONGODB_URI=mongodb://localhost:27017/testing-system

# ===== JWT =====
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# ===== SERVER =====
PORT=5000
NODE_ENV=development

# ===== CORS =====
FRONTEND_URL=http://localhost:3000
```

**Для MongoDB Atlas (облако):**
Замените MONGODB_URI на:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/testing-system?retryWrites=true&w=majority
```

#### Frontend (.env файл):

```bash
cd ../frontend
cp .env.example .env
```

Отредактируйте `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ▶️ Запуск проекта

### Вариант 1: В отдельных терминалах (рекомендуется)

**Терминал 1 - Backend:**
```bash
cd backend
npm run dev
```
Сервер запустится на: **http://localhost:5000**

**Терминал 2 - Frontend:**
```bash
cd frontend
npm start
```
Приложение откроется в браузере: **http://localhost:3000**

### Вариант 2: Загрузка тестовых данных

Перед первым использованием нужно загрузить тестовые данные:

```bash
cd backend
npm run seed
```

Это создаст:
- 1 admin аккаунт
- 5 обычных пользователей
- ~24 вопроса
- 8 тестов (по одному на каждый предмет)

---

## 🔐 Тестовые аккаунты

Используйте эти данные для входа после запуска `npm run seed`:

### Admin (администратор):
```
Email: admin@example.com
Пароль: admin123
```
**Доступ:** Администраторская панель, управление всем контентом

### Обычный пользователь:
```
Email: user1@example.com
Пароль: password123
```
**Доступ:** Прохождение тестов, просмотр результатов

---

## 📚 API Документация

### Основной URL: `http://localhost:5000/api`

### #### 🔓 Публичные endpoints (без авторизации)

**Регистрация:**
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Вход:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "ivan@example.com",
  "password": "password123"
}
```

Ответ включает **token**, который используется для других запросов:
```json
{
  "message": "Вход успешен",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "role": "user"
  }
}
```

---

### 🔒 Защищенные endpoints (требуется Token)

Все защищенные запросы требуют заголовка:
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Профиль:
```http
GET /auth/profile
Authorization: Bearer [token]
```

#### Тесты:
```http
# Получить все тесты
GET /tests

# Получить тесты по категории
GET /tests/category/Математика

# Получить тест с вопросами
GET /tests/{testId}/questions
```

#### Вопросы (только для админа):
```http
# Получить все вопросы
GET /questions

# Создать вопрос (admin)
POST /questions
Content-Type: application/json
Authorization: Bearer [admin_token]

{
  "text": "Чему равно 2+2?",
  "category": "Математика",
  "difficulty": "easy",
  "options": ["3", "4", "5", "6"],
  "correctAnswerIndex": 1,
  "explanation": "2+2=4"
}
```

#### Результаты:
```http
# Отправить тест
POST /results/submit
Authorization: Bearer [token]

{
  "testId": "...",
  "answers": [
    {"questionId": "...", "selectedAnswerIndex": 1},
    ...
  ],
  "timeSpent": 1200
}

# Получить результаты пользователя
GET /results/my-results
Authorization: Bearer [token]

# Получить результат по ID
GET /results/{resultId}
Authorization: Bearer [token]

# Получить лидерборд
GET /results/leaderboard/top

# Получить статистику (admin)
GET /results/stats/admin
Authorization: Bearer [admin_token]
```

---

## 📁 Структура проекта

```
online-testing-system/
│
├── backend/                           # Node.js + Express backend
│   ├── src/
│   │   ├── models/                   # MongoDB схемы
│   │   │   ├── User.js               # Модель пользователя
│   │   │   ├── Question.js           # Модель вопроса
│   │   │   ├── Test.js               # Модель теста
│   │   │   ├── Result.js             # Модель результатов
│   │   │   └── index.js              # Экспорт всех моделей
│   │   │
│   │   ├── controllers/              # Бизнес логика
│   │   │   ├── authController.js     # Регистрация/вход
│   │   │   ├── testController.js     # Управление тестами
│   │   │   ├── questionController.js # Управление вопросами
│   │   │   └── resultController.js   # Обработка результатов
│   │   │
│   │   ├── routes/                   # API маршруты
│   │   │   ├── authRoutes.js
│   │   │   ├── testRoutes.js
│   │   │   ├── questionRoutes.js
│   │   │   └── resultRoutes.js
│   │   │
│   │   ├── middleware/               # Express middleware
│   │   │   └── auth.js               # JWT проверка и роли
│   │   │
│   │   ├── utils/                    # Вспомогательные функции
│   │   │   └── helpers.js            # Token, shuffle, score calc
│   │   │
│   │   └── server.js                 # Точка входа сервера
│   │
│   ├── config/
│   │   └── database.js               # MongoDB подключение
│   │
│   ├── seeds/
│   │   └── seedDatabase.js           # Загрузка тестовых данных
│   │
│   ├── .env.example                  # Пример переменных окружения
│   ├── package.json
│   └── README.md
│
├── frontend/                          # React приложение
│   ├── src/
│   │   ├── components/               # React компоненты
│   │   │   ├── Navigation.js         # Навигация
│   │   │   └── ProtectedRoute.js     # Защита маршрутов
│   │   │
│   │   ├── pages/                    # Страницы приложения
│   │   │   ├── Home.js               # Главная
│   │   │   ├── Login.js              # Вход
│   │   │   ├── Register.js           # Регистрация
│   │   │   ├── Tests.js              # Список тестов
│   │   │   ├── TestTaking.js         # Прохождение теста
│   │   │   ├── Result.js             # Результаты теста
│   │   │   ├── Results.js            # История результатов
│   │   │   ├── Leaderboard.js        # Лидерборд
│   │   │   └── AdminPanel.js         # Админ панель
│   │   │
│   │   ├── services/
│   │   │   └── api.js                # API клиент (axios)
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js        # Context для авторизации
│   │   │
│   │   ├── styles/
│   │   │   └── index.css             # Глобальные стили
│   │   │
│   │   ├── App.js                    # Главный компонент
│   │   └── index.js                  # Entry point
│   │
│   ├── public/
│   │   └── index.html                # HTML шаблон
│   │
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── README.md                          # Этот файл
└── LICENSE
```

---

## 🎯 Использование приложения

### 1. Регистрация и вход
- Перейдите на `/register` или `/login`
- Введите свои данные
- После входа будет выдан JWT токен

### 2. Выбор и прохождение теста
- На странице `/tests` выберите нужный тест
- Нажмите "Начать тест"
- Прочитайте инструкции и нажмите "Начать тест"
- Отвечайте на вопросы (таймер запустится автоматически)
- Результаты будут сохранены автоматически

### 3. Просмотр результатов
- Перейдите на `/results`
- Посмотрите историю всех тестов
- Нажмите "Просмотр" для подробного разбора

### 4. Администраторская панель (для admin@example.com)
- Перейдите на `/admin`
- **Статистика:** Общие цифры и проблемные вопросы
- **Управление вопросами:** Добавляйте/удаляйте вопросы
- **Управление тестами:** Создавайте/удаляйте тесты

---

## 🔧 Возможные проблемы и решения

### MongoDB не подключается
```
Решение:
1. Убедитесь, что MongoDB запущен:
   - macOS: brew services start mongodb-community
   - Windows: net start MongoDB
   - Linux: sudo service mongod start

2. Проверьте MONGODB_URI в .env файле
3. Если используете Atlas, скопируйте верный connection string
```

### "Cannot find module" ошибка
```
Решение:
cd backend (или frontend)
npm install
npm audit fix --force
```

### CORS ошибка при запросах
```
Решение:
1. Убедитесь, что backend запущен на http://localhost:5000
2. FRONTEND_URL в backend/.env = http://localhost:3000
3. Перезагрузите систему
```

### Таймер тестирования работает неправильно
```
Решение:
Проверьте синхронизацию часов на вашем компьютере
```

---

## 📊 Базовая схема базы данных

### User (Пользователь)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('user' | 'admin'),
  totalTests: Number,
  averageScore: Number,
  createdAt: Date
}
```

### Question (Вопрос)
```javascript
{
  _id: ObjectId,
  text: String,
  category: String,
  difficulty: String ('easy' | 'medium' | 'hard'),
  options: [
    { text: String, isCorrect: Boolean },
    ...
  ],
  correctAnswerIndex: Number,
  explanation: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

### Test (Тест)
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  timeLimit: Number (minutes),
  questionCount: Number,
  questions: [ObjectId] (ref: Question),
  totalAttempts: Number,
  averageScore: Number,
  isActive: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

### Result (Результат)
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  test: ObjectId (ref: Test),
  category: String,
  answers: [
    {
      questionId: ObjectId,
      selectedAnswerIndex: Number,
      isCorrect: Boolean,
      questionText: String
    }
  ],
  score: Number,
  percentage: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  timeSpent: Number (seconds),
  startedAt: Date,
  submittedAt: Date
}
```

---

## 🎓 Категории тестов

1. **Математика** - Арифметика, геометрия, алгебра
2. **Русский язык** - Грамматика, пунктуация, литература
3. **Физика** - Механика, электричество, оптика
4. **Химия** - Органическая и неорганическая химия
5. **Биология** - Анатомия, генетика, экология
6. **История** - Даты, события, персоны
7. **География** - Страны, города, рельеф
8. **Английский язык** - Грамматика, словарный запас

---

## 🚀 Дальнейшее развитие

### Функции для добавления:
- [ ] AI генератор вопросов
- [ ] Экспорт результатов в PDF
- [ ] Система уведомлений по email
- [ ] Группы/классы студентов
- [ ] Рекомендации по слабым местам
- [ ] Загрузка вопросов из CSV
- [ ] Прямые трансляции тестов
- [ ] Интеграция с LMS системами (Moodle, Canvas)

### Улучшения производительности:
- [ ] Redis кэширование
- [ ] Оптимизация запросов БД
- [ ] Lazy loading часть компонентов
- [ ] Service Workers для offline режима
- [ ] CDN для статических файлов

### Безопасность:
- [ ] Rate limiting
- [ ] 2FA двухфакторная авторизация
- [ ] HTTPS/SSL сертификаты
- [ ] Защита от SQL injection
- [ ] OWASP compliance

---

## 📞 Поддержка

Если у вас есть вопросы или проблемы:

1. Проверьте документацию выше
2. Посмотрите логи в консоли
3. Убедитесь, что все сервисы запущены
4. Проверьте переменные окружения

---

## 📄 Лицензия

MIT License - см. файл LICENSE

---

## 👨‍💻 Автор

Online Testing System v1.0
Создано для системы подготовки студентов к экзаменам

**Happy Testing! 🎓📚**

---

## 📝 Примечания

- Все пароли хешируются с помощью bcryptjs (10 соль раунды)
- JWT токены действительны 7 дней (можно изменить в .env)
- База данных требует MongoDB 4.4 или новее
- Рекомендуется использовать Node.js 16+ для лучшей совместимости
- В production среде используйте HTTPS и безопасные переменные окружения

---

**Версия:** 1.0.0  
**Дата создания:** Апрель 2026  
**Статус:** Production Ready ✅
