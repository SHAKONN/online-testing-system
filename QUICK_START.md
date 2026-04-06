
# ⚡ БЫСТРЫЙ СТАРТ - Online Testing System

**Прочитайте это первым!!!**

---

## 🎯 За 5 минут к работающему приложению

### Шаг 1: Установка зависимостей (2 минуты)

```bash
# Backend
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system/backend
npm install

# Frontend  
cd ../frontend
npm install
```

### Шаг 2: Настройка MongoDB

**Вариант A: Локальный MongoDB**
```bash
# macOS (если установлен Homebrew)
brew services start mongodb-community

# Windows (если MongoDB установлена)
net start MongoDB

# Linux
sudo service mongod start
```

**Вариант B: MongoDB Atlas (облако)**
- Зайдите на https://www.mongodb.com/cloud/atlas
- Создайте бесплатный кластер
- Скопируйте connection string
- Вставьте в `backend/.env` (MONGODB_URI)

### Шаг 3: Создание .env файлов (1 минута)

**Backend** - `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/testing-system
JWT_SECRET=my-secret-key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend** - `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Шаг 4: Загрузка тестовых данных (10 сек)

```bash
cd backend
npm run seed
```

✅ Команда создаст:
- admin@example.com / admin123
- user1@example.com / password123
- 24 вопроса
- 8 тестов

### Шаг 5: Запуск (2 минуты)

**Терминал 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Сервер запустится: http://localhost:5000

**Терминал 2 - Frontend:**
```bash
cd frontend
npm start
```
✅ Приложение откроется: http://localhost:3000

---

## 🔐 Тестовые аккаунты для входа

### Администратор:
```
Email: admin@example.com
Пароль: admin123
```
→ Доступ к: `/admin` панели

### Обычный пользователь:
```
Email: user1@example.com
Пароль: password123
```
→ Может: Проходить тесты, смотреть результаты

---

## 📖 Что дальше?

### Для пользователей:
1. Зайдите на сайт в `/tests`
2. Выберите тест из списка
3. Нажмите "Начать тест"
4. Отвечайте на вопросы
5. Смотрите результаты

### Для администраторов:
1. Зайдите как admin@example.com
2. Перейдите на `/admin`
3. Добавляйте вопросы и тесты
4. Смотрите статистику

---

## 🆘 Если что-то не работает

| Проблема | Решение |
|----------|---------|
| **MongoDB connection error** | Проверьте, запущен ли MongoDB (см. Шаг 2) |
| **"Cannot find module"** | Выполните `npm install` в папке |
| **CORS ошибка** | Убедитесь, что backend на 5000, frontend на 3000 |
| **Тесты не загружаются** | Выполните `npm run seed` в backend |
| **Забыли пароль** | Используйте тестовые данные выше |

---

## 📁 Файловая структура

```
diploma/online-testing-system/
├── backend/              # Express сервер
│   ├── src/
│   ├── config/
│   ├── seeds/
│   ├── .env              ← СОЗДАЙТЕ ЭТО
│   └── package.json
│
├── frontend/             # React приложение
│   ├── src/
│   ├── public/
│   ├── .env              ← СОЗДАЙТЕ ЭТО
│   └── package.json
│
└── README.md             # Полная документация
```

---

## 🎓 Основные страницы

| Страница | URL | Описание |
|----------|-----|---------|
| Главная | `/` | Начальная страница |
| Вход | `/login` | Авторизация |
| Регистрация | `/register` | Создание аккаунта |
| Тесты | `/tests` | Список всех тестов |
| Тестирование | `/test/:id` | Прохождение теста |
| Результаты | `/results` | История результатов |
| Лидерборд | `/leaderboard` | Рейтинг пользователей |
| Админ панель | `/admin` | Управления (только для админа) |

---

## 💡 Полезные команды

```bash
# Backend
npm run dev          # Запуск в режиме разработки
npm run seed         # Загрузка тестовых данных
npm start            # Запуск production

# Frontend
npm start            # Запуск сервера разработки
npm build            # Сборка для production
npm test             # Запуск тестов
```

---

## 🔗 Полезные ссылки

- 📖 **Полная документация:** [README.md](README.md)
- 🗄️ **MongoDB Docs:** https://docs.mongodb.com
- ⚛️ **React Docs:** https://react.dev
- 🚂 **Express Docs:** https://expressjs.com

---

## ✅ Контрольный список

- [ ] Node.js установлен (`node --version`)
- [ ] npm установлен (`npm --version`)
- [ ] MongoDB работает
- [ ] `npm install` выполнена для backend
- [ ] `npm install` выполнена для frontend
- [ ] `.env` файлы созданы
- [ ] `npm run seed` выполнена
- [ ] Backend запущен на :5000
- [ ] Frontend запущен на :3000
- [ ] Можете войти на admin@example.com

---

**Готово! Система работает! 🚀**

Если возникнут вопросы, смотрите полную документацию в [README.md](README.md)

---
*Версия: 1.0.0*  
*Обновлено: Апрель 2026*
