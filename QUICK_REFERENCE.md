# 🚀 Быстрая Справка

## В ЭТОТ МОМЕНТ (Апрель 2026):

```
✅ УСТАНОВЛЕНО:     Весь код, зависимости npm, конфигурация
⏳ ТРЕБУЕТСЯ СЕЙЧАС: Docker Desktop + 3 команды
📦ВСЁ ГОТОВО К:     Production использованию
```

---

## 🎯 НАЧНИТЕ ОТСЮДА (5 МИНУТ):

### 1. Docker Desktop
```bash
CMD + SPACE → "Docker" → ENTER
⏳ Подождите 60 сек...
```

### 2. MongoDB
```bash
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system
docker-compose up -d
```

### 3. Три терминала (параллельно):

**Terminal 1:**
```bash
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system/backend
npm run dev
# Дождитесь: ✅ Сервер запущен на порту 5000
```

**Terminal 2:** _(после T1)_
```bash
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system/backend
npm run seed
# Дождитесь: ✅ Данные успешно загружены
```

**Terminal 3:** _(после T1)_
```bash
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system/frontend
npm start
# Браузер откроется автоматически
```

---

## 🔐 Учетные данные:
- **Админ:** admin@example.com / admin123
- **Пользователь:** user1@example.com / password123

---

## 📚 Файлы для чтения (по порядку):

1. **[FINAL_STEPS.md](./FINAL_STEPS.md)** ← ЧИТАЙТЕ ПЕРВЫМ (3 шага)
2. **[PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md)** ← Всё о проекте
3. **[README.md](./README.md)** ← Полная документация
4. **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** ← Структура БД
5. **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** ← Структура проекта

---

## 🆘 Быстрые решения:

**Docker daemon не работает:**
```bash
open -a Docker  # или откройте Applications → Docker
```

**MongoDB не подключается:**
```bash
docker ps | grep mongodb
docker-compose down && docker-compose up -d
```

**Port занят:**
```bash
lsof -i :3000   # или :5000
kill -9 [PID]
```

---

## ✨ Готово к запуску!
