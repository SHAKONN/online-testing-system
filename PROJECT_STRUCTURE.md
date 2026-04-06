# 🌳 ПОЛНАЯ ФАЙЛОВАЯ СТРУКТУРА ПРОЕКТА

```
online-testing-system/
│
├── 📄 README.md                    ← НАЧНИТЕ ОТСЮДА (полная документация)
├── 📄 QUICK_START.md               ← Быстрый старт за 5 минут
├── 📄 DATABASE_SCHEMA.md           ← Схема базы данных
├── 📄 PROJECT_SUMMARY.md           ← Итоговый отчет
├── 📄 FILES_LIST.md                ← Этот файл
│
│
├── 📁 backend/                     ← NODE.JS + EXPRESS + MONGODB
│   │
│   ├── 📄 package.json             (express, mongoose, bcryptjs, jwt, cors, dotenv)
│   ├── 📄 .env.example             (пример переменных окружения)
│   │
│   ├── 📁 src/                     (основной код)
│   │   │
│   │   ├── 📁 models/              (MongoDB схемы)
│   │   │   ├── 📄 User.js          (пользователь: name, email, password, role)
│   │   │   ├── 📄 Question.js      (вопрос: text, options, category, difficulty)
│   │   │   ├── 📄 Test.js          (тест: title, questions[], timeLimit)
│   │   │   ├── 📄 Result.js        (результат: answers, score, percentage)
│   │   │   └── 📄 index.js         (экспорт всех моделей)
│   │   │
│   │   ├── 📁 controllers/         (бизнес логика)
│   │   │   ├── 📄 authController.js    (register, login, getProfile)
│   │   │   ├── 📄 testController.js    (CRUD тесты + getTestWithQuestions)
│   │   │   ├── 📄 questionController.js (CRUD вопросы)
│   │   │   └── 📄 resultController.js   (submitTest, getUserResults, getLeaderboard, stats)
│   │   │
│   │   ├── 📁 routes/              (API маршруты)
│   │   │   ├── 📄 authRoutes.js        (POST /register, /login, GET /profile)
│   │   │   ├── 📄 testRoutes.js        (GET/POST/PUT/DELETE /tests)
│   │   │   ├── 📄 questionRoutes.js    (GET/POST/PUT/DELETE /questions)
│   │   │   └── 📄 resultRoutes.js      (POST /submit, GET /my-results, /leaderboard)
│   │   │
│   │   ├── 📁 middleware/          (Express middleware)
│   │   │   └── 📄 auth.js              (JWT проверка, роли checking)
│   │   │
│   │   ├── 📁 utils/               (вспомогательные функции)
│   │   │   └── 📄 helpers.js           (generateToken, shuffleArray, calculateScore)
│   │   │
│   │   └── 📄 server.js            (⭐ ГЛАВНЫЙ ФАЙЛ - Express приложение)
│   │
│   ├── 📁 config/                  (конфигурация)
│   │   └── 📄 database.js              (подключение к MongoDB)
│   │
│   ├── 📁 seeds/                   (загрузка данных)
│   │   └── 📄 seedDatabase.js          (создает 6 пользователей, 24 вопроса, 8 тестов)
│   │
│   └── 📁 node_modules/            (зависимости - создается при npm install)
│
│
├── 📁 frontend/                    ← REACT 18
│   │
│   ├── 📄 package.json             (react, react-router-dom, axios, react-scripts)
│   ├── 📄 .env.example             (пример переменных окружения)
│   │
│   ├── 📁 src/                     (исходный код React)
│   │   │
│   │   ├── 📁 components/          (переиспользуемые компоненты)
│   │   │   ├── 📄 Navigation.js     (🎓 Верхняя панель навигации)
│   │   │   └── 📄 ProtectedRoute.js (основной компонент для защиты маршрутов)
│   │   │
│   │   ├── 📁 pages/               (страницы приложения)
│   │   │   ├── 📄 Home.js              (/ главная страница)
│   │   │   ├── 📄 Login.js             (/login вход в систему)
│   │   │   ├── 📄 Register.js          (/register регистрация)
│   │   │   ├── 📄 Tests.js             (/tests выбор теста + фильтр по категориям)
│   │   │   ├── 📄 TestTaking.js        (/test/:id прохождение теста с таймером)
│   │   │   ├── 📄 Result.js            (/result/:id просмотр результатов)
│   │   │   ├── 📄 Results.js           (/results история всех результатов)
│   │   │   ├── 📄 Leaderboard.js       (/leaderboard лидерборд топ пользователей)
│   │   │   └── 📄 AdminPanel.js        (/admin админ панель: статистика, вопросы, тесты)
│   │   │
│   │   ├── 📁 services/            (API клиент)
│   │   │   └── 📄 api.js               (Axios инстанс + все HTTP методы)
│   │   │
│   │   ├── 📁 context/             (глобальное состояние)
│   │   │   └── 📄 AuthContext.js       (Context для авторизации, пользователя, токена)
│   │   │
│   │   ├── 📁 styles/              (CSS стили)
│   │   │   └── 📄 index.css            (400+ строк: компоненты, утилиты, responsive)
│   │   │
│   │   ├── 📄 App.js               (⭐ главный React компонент - routing)
│   │   └── 📄 index.js             (entry point - ReactDOM.render)
│   │
│   ├── 📁 public/                  (статические файлы)
│   │   └── 📄 index.html               (HTML шаблон с <div id="root">)
│   │
│   └── 📁 node_modules/            (зависимости - создается при npm install)
│
│
└── 📁 .git/                        (Git репозиторий - если инициализировано)
```

---

## 📊 СТРУКТУРА КОМПЛЕКСНО

### Backend слои:
```
Request → routes → middleware (auth) → controllers → models → MongoDB
Response ← routes ← controller ← models ← query result
```

### Frontend слои:
```
User → Pages → Components → Services (API) → Backend
Display ← State (Context) ← API responses
```

---

## 🚀 ТОЧКИ ВХОДА

### Backend:
```bash
node backend/src/server.js         # Production запуск
nodemon backend/src/server.js      # Development запуск
node backend/seeds/seedDatabase.js # Загрузка данных
```

### Frontend:
```bash
npm start                          # Dev сервер на :3000
npm run build                      # Production бундл
npm run serve                      # Serve бундла
```

---

## 📁 КЛЮЧЕВЫЕ ПАПКИ

| Папка | Назначение | Кол-во файлов |
|-------|-----------|--------------|
| `backend/src/models` | Схемы БД | 5 |
| `backend/src/controllers` | Логика обработки | 4 |
| `backend/src/routes` | API маршруты | 4 |
| `frontend/src/pages` | Страницы приложения | 9 |
| `frontend/src/components` | Переиспользуемые части | 2 |
| `frontend/src/context` | Глобальное состояние | 1 |
| `frontend/src/services` | API клиент | 1 |

---

## 🔄 СВЯЗИ МЕЖДУ ПАПКАМИ

```
routes/ → controllers/ → models/ ← Database
   ↓
   services/ ← Data flow
      ↓
   pages/ & components/
      ↓
   context/ (AuthContext)
      ↓
   styles/
```

---

## 📄 ФАЙЛЫ ПО ТИПАМ

### JavaScript файлы (Backend): 16
```
- 4 модели
- 4 контроллера
- 4 маршрута
- 2 утилиты
- 1 middleware
- 1 конфиг БД
```

### JavaScript файлы (Frontend): 13
```
- 9 страниц
- 2 компонента
- 1 сервис
- 1 контекст
```

### CSS файлы: 1
```
- 1 глобальный (400+ строк)
```

### HTML файлы: 1
```
- index.html шаблон
```

### JSON файлы: 2
```
- backend/package.json
- frontend/package.json
```

### Мардаун файлы: 5
```
- README.md
- QUICK_START.md
- DATABASE_SCHEMA.md
- PROJECT_SUMMARY.md
- FILES_LIST.md (этот файл)
```

### .env файлы: 2
```
- backend/.env.example
- frontend/.env.example
```

---

## 🎯 НАВИГАЦИЯ ПО ПРОЕКТУ

### Если вы хотите...

**...понять архитектуру:**
- Смотрите: `README.md` → `DATABASE_SCHEMA.md`

**...быстро запустить:**
- Смотрите: `QUICK_START.md`

**...развить API endpoint:**
- Смотрите: `backend/src/routes/` → `backend/src/controllers/`

**...добавить React страницу:**
- Смотрите: `frontend/src/pages/Home.js` как пример

**...изменить стили:**
- Смотрите: `frontend/src/styles/index.css`

**...добавить функцию авторизации:**
- Смотрите: `frontend/src/context/AuthContext.js`

**...понять API клиент:**
- Смотрите: `frontend/src/services/api.js`

**...добавить новую роль:**
- Смотрите: `backend/src/middleware/auth.js`

---

## 📦 ИТОГО

| Категория | Кол-во | Примечание |
|-----------|--------|-----------|
| **Backend файлы** | 16 | .js файлы в src/ |
| **Frontend файлы** | 13 | React компоненты |
| **Конфиг файлы** | 4 | package.json, .env |
| **Документация** | 5 | .md файлы |
| **HTML шаблоны** | 1 | index.html |
| **CSS/Styles** | 1 | index.css |
| **ИТОГО** | **40+** | **Готовый проект** |

---

## 🚦 СТАТУС ФАЙЛОВ

- ✅ Все файлы созданы
- ✅ Все зависимости описаны
- ✅ Все маршруты определены
- ✅ Все компоненты готовы
- ✅ Все стили подготовлены
- ✅ Вся документация написана

---

**Версия:** 1.0.0  
**Дата:** Апрель 2026  
**Язык:** JavaScript/React  
**Статус:** ✅ Ready to Use
