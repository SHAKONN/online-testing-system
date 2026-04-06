# 🚀 ИНСТРУКЦИЯ ПО ЗАПУСКУ ПРОЕКТА

## 📋 ЧТО УЖЕ СДЕЛАНО:

✅ Установлены Node.js и npm (v22.0.0 и v10.5.1)
✅ Установлены зависимости Backend (144 пакеты)
✅ Установлены зависимости Frontend (1303 пакеты)
✅ Созданы файлы .env для backend и frontend
✅ Создан docker-compose.yml для MongoDB

---

## 🔥 ТРЕБУЕТСЯ ОДНО ИЗ ДВУХ:

### ВАРИАНТ A: Использовать MongoDB через Docker ✨ РЕКОМЕНДУЕТСЯ

**Шаг 1:** Откройте Docker Desktop (найди в Applications) или запустите:
```bash
open -a Docker
```

**Шаг 2:** Подождите 30 секунд, чтобы Docker запустился

**Шаг 3:** В терминале запустите:
```bash
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system
docker-compose up -d
```

**Шаг 4:** Проверьте, что MongoDB запущена:
```bash
docker ps | grep mongodb
```

### ВАРИАНТ B: Установить MongoDB локально (сложнее)

Скачайте MongoDB Community Edition с https://www.mongodb.com/try/download/community
и следуйте инструкциям для macOS.

---

## ▶️ ЗАПУСК ПРИЛОЖЕНИЯ (после MongoDB)

### Терминал 1 - Backend:
```bash
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system/backend
npm run dev
```

Должна появиться:
```
✅ MongoDB подключена: localhost
✅ Сервер запущен на порту 5000
📍 URL: http://localhost:5000
```

### Терминал 2 - Загрузка тестовых данных:
Когда backend запустится, в новом терминале:
```bash
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system/backend
npm run seed
```

### Терминал 3 - Frontend:
```bash
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system/frontend
npm start
```

Откроется браузер на http://localhost:3000

---

## 🔐 ТЕСТОВЫЕ АККАУНТЫ:

**Admin:**
- Email: admin@example.com
- Password: admin123

**User:**
- Email: user1@example.com
- Password: password123

---

## 📊 СТАТУС ИНСТАЛЛЯЦИИ:

| Компонент | Статус |
|-----------|--------|
| Node.js v22.0.0 | ✅ Установлено |
| npm v10.5.1 | ✅ Установлено |
| Backend зависимости | ✅ Установлены |
| Frontend зависимости | ✅ Установлены |
| Backend .env | ✅ Создан |
| Frontend .env | ✅ Создан |
| Docker Compose | ✅ Создан |
| MongoDB | ⏳ Требует запуска |

---

## ❓ ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ:

### npm ERR! код ENOENT:
```bash
# Переустановите зависимости:
cd backend
rm -rf node_modules
npm install

cd ../frontend
rm -rf node_modules
npm install
```

### MongoDB connection error:
```bash
# Проверьте docker:
docker ps
docker logs online-testing-mongodb

# Или перезапустите:
docker-compose down
docker-compose up
```

### Port 3000 or 5000 уже в использовании:
```bash
# Найдите процесс:
lsof -i :3000
lsof -i :5000

# Убейте его (замените PID):
kill -9 PID
```

### React компилация не удалась:
```bash
cd frontend
npm cache clean --force
npm install
npm start
```

---

## 🔄 ПОЛНЫЙ ПРОЦЕСС В ОДНОМ ОКНЕ (для быстрого старта):

```bash
# 1. Открыть Docker Desktop (вручную или):
open -a Docker

# 2. Подождать 30 сек, потом:
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system

# 3. Запустить MongoDB:
docker-compose up -d

# 4. Запустить Backend:
cd backend && npm run dev &

# 5. Подождать 3 сек, потом загрузить данные:
sleep 3 && npm run seed

# 6. Запустить Frontend (в новом терминале):
cd ../frontend && npm start
```

---

## 📚 ДОКУМЕНТАЦИЯ:

- [README.md](./README.md) - Полная документация
- [QUICK_START.md](./QUICK_START.md) - Краткий старт
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Структура БД
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Структура проекта

---

**Готово? Начните с Варианта A (Docker)! 🚀**

Если возникнут вопросы - смотрите документацию выше.
