# 🚈 RAILWAY.APP DEPLOYMENT - ШАГ ЗА ШАГОМ

## ✅ RAILWAY - ОТЛИЧНЫЙ ВЫБОР!

```
✓ Простой интерфейс
✓ GitHub интеграция
✓ MongoDB в один клик
✓ Автоматический deploy
✓ Хорошая документация
✓ Стабильный и надежный
✓ $5-15/месяц
```

---

## 🚀 ПОЛНАЯ ИНСТРУКЦИЯ:

### ШАГ 1️⃣: Подготовьте GitHub репозиторий

#### Вариант A: Если уже есть GitHub репо
```bash
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system

# Если еще не git
git init
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

#### Вариант B: Если нет GitHub репо
```bash
# 1. Создайте новый репозиторий на GitHub.com
#    Нажмите "+" → "New repository"
#    Назовите: online-testing-system
#    Не инициализируйте README, .gitignore, license

# 2. Затем в terиминале:
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system

git init
git add .
git commit -m "Initial commit - Online Testing System"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/online-testing-system.git
git push -u origin main
```

✅ **Код загружен на GitHub!**

---

### ШАГ 2️⃣: Создайте аккаунт на Railway

1. Откройте **https://railway.app**
2. Нажмите **"Sign up"**
3. Выберите **"GitHub"** для входа
4. Авторизуйте GitHub
5. ✅ **Готово!**

---

### ШАГ 3️⃣: Создайте новый проект

1. На главной странице Railway нажмите **"New Project"**
2. Выберите **"Deploy from GitHub repo"**
3. Выберите ваш репозиторий **`online-testing-system`**
4. Нажмите **"Deploy"**

✅ **Проект создан!**

---

### ШАГ 4️⃣: Добавьте MongoDB

1. В Railway перейдите в проект
2. Нажмите **"+ New"** (в левой панели)
3. Нажмите **"Database"**
4. Выберите **"MongoDB"**
5. Выберите **"Create"**

✅ **MongoDB в облаке готова!**

---

### ШАГ 5️⃣: Создайте Backend сервис

#### Вариант 1: Автоматический (если Railway обнаружит)
Railway может автоматически обнаружить backend в папке `/backend`

#### Вариант 2: Ручной (если не обнаружил)

1. В Railway нажмите **"+ New"**
2. Нажмите **"GitHub Repo"**
3. Выберите ваш репозиторий
4. Выберите **"Deploy"**
5. В настройках измените:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

✅ **Backend сервис создан!**

---

### ШАГ 6️⃣: Настройте переменные Backend

1. В Railway откройте Backend сервис
2. Нажмите на **вкладку "Variables"** (справа)
3. Добавьте переменные:

```
NODE_ENV = production
PORT = 5001
JWT_SECRET = your-secret-key-change-this-min-32-chars-safe
FRONTEND_URL = https://{your-frontend-name}.railway.app
CORS_ORIGIN = https://{your-frontend-name}.railway.app
```

4. Для MONGODB_URI:
   - Railway автоматически создаст эту переменную!
   - Она будет такой: `mongodb://...`
   - Просто используйте: `${{DATABASE_URL}}`

```
MONGODB_URI = ${{DATABASE_URL}}/testing-system?retryWrites=true&w=majority
```

✅ **Переменные установлены!**

---

### ШАГ 7️⃣: Создайте Frontend сервис

1. В Railway нажмите **"+ New"**
2. Нажмите **"GitHub Repo"**
3. Выберите ваш репозиторий
4. Выберите **"Deploy"**
5. В настройках измените:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

Или используйте Nixpacks автоматически.

✅ **Frontend сервис создан!**

---

### ШАГ 8️⃣: Настройте переменные Frontend

1. В Railway откройте Frontend сервис
2. Нажмите на **вкладку "Variables"**
3. Добавьте переменные:

```
REACT_APP_API_URL = https://{your-backend-name}.railway.app/api
```

✅ **Переменные установлены!**

---

### ШАГ 9️⃣: Загрузите тестовые данные

#### Способ 1: Через Railway CLI
```bash
# Установите Railway CLI
npm install -g @railway/cli

# Логинитесь
railway login

# Перейдите в проект
railway link

# Запустите seed в backend контейнере
railway run npm run seed
```

#### Способ 2: Вручную через Backend endpoint
```bash
# После deploy, запустите:
curl -X POST https://your-backend.railway.app/api/seed \
  -H "Content-Type: application/json"
```

(Если у вас есть endpoint /api/seed в backend)

✅ **Тестовые данные загружены!**

---

## 🎯 ИТОГОВАЯ АРХИТЕКТУРА В RAILWAY:

```
online-testing-system (Project)
├── Backend (Node.js)
│   ├── Build: npm install
│   ├── Start: npm start
│   ├── Port: 5001
│   ├── Variables: NODE_ENV, JWT_SECRET, MONGODB_URI, etc.
│   └── URL: https://online-testing-backend.railway.app
│
├── Frontend (Node.js)
│   ├── Build: npm install && npm run build
│   ├── Start: npm start
│   ├── Port: 3000
│   ├── Variables: REACT_APP_API_URL
│   └── URL: https://online-testing-frontend.railway.app
│
└── MongoDB (Database)
    ├── Type: MongoDB
    ├── Database: testing-system
    ├── URL: mongodb://...
    └── Connected to Backend
```

---

## 📊 АВТОМАТИЧЕСКИЙ DEPLOY

После первого deploy:
- Каждый раз когда вы пушите на GitHub (`main` ветка)
- Railway **АВТОМАТИЧЕСКИ** перебирает и деплойит!
- Примерно 5-10 минут на полный deploy

```bash
# Просто пушьте обновления:
git add .
git commit -m "Update"
git push origin main

# Railway сама обновит production! 🚀
```

---

## 🔐 ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (ПОЛНЫЙ СПИСОК)

### Backend Variables:
```
NODE_ENV=production
PORT=5001
JWT_SECRET=your-super-secret-key-min-32-characters-change-this
MONGODB_URI=${{DATABASE_URL}}/testing-system?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend-name.railway.app
CORS_ORIGIN=https://your-frontend-name.railway.app
```

### Frontend Variables:
```
REACT_APP_API_URL=https://your-backend-name.railway.app/api
```

---

## ✅ ПРОВЕРКА DEPLOYMENT

### 1. Backend проверка:
```bash
# Откройте браузер
https://your-backend.railway.app

# Должны увидеть ошибку 404 или сообщение
# Это значит backend работает ✅
```

### 2. Frontend проверка:
```bash
# Откройте браузер
https://your-frontend.railway.app

# Должны увидеть страницу Login ✅
```

### 3. Логин проверка:
```bash
Email: admin@example.com
Password: admin123

# Должны войти и увидеть Dashboard ✅
```

### 4. API проверка:
```bash
curl -X POST https://your-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Должны получить: {"message":"Вход успешен","token":"..."}
```

---

## 🆘 ПРОБЛЕМЫ И РЕШЕНИЯ

### Проблема 1: Backend не деплойтится
```
❌ "Cannot find module"
```

**Решение:**
1. Убедитесь что `backend/package.json` на месте
2. Проверьте что `npm install` работает локально
3. Очистите Railway cache:
   - Settings → Redeploy
   - Нажмите "Force Redeploy"

---

### Проблема 2: Frontend ошибка при входе
```
❌ "Cannot connect to /api/auth/login"
```

**Решение:**
1. Проверьте переменную `REACT_APP_API_URL` в Frontend
2. Убедитесь что backend URL правильный
3. Проверьте CORS в backend
4. Hard refresh в браузере: `CMD+Shift+R`

---

### Проблема 3: MongoDB не подключается
```
❌ "connect ECONNREFUSED"
```

**Решение:**
1. Проверьте что MongoDB сервис создан в Railway
2. Проверьте переменную `MONGODB_URI` в Backend
3. Убедитесь что DATABASE_URL подставляется: `${{DATABASE_URL}}`
4. Заново создайте MongoDB сервис

---

### Проблема 4: Логин не работает после тестовых данных
```
❌ "Ошибка входа"
```

**Решение:**
1. Загрузите seed данные:
   ```bash
   railway run npm run seed
   ```
2. Или создайте пользователя вручную через API
3. Проверьте что MONGODB_URI правильный

---

## 📱 ФИНАЛЬНЫЕ АДРЕСА

После успешного deployment:

```
🌐 Frontend:  https://your-frontend-name.railway.app
🔌 Backend:   https://your-backend-name.railway.app/api
📊 Database:  MongoDB (внутренний, не доступен снаружи)

🔐 Админ:     admin@example.com / admin123
👤 Пользо:    user1@example.com / password123
```

---

## 📚 ПОЛЕЗНЫЕ ССЫЛКИ RAILWAY

- **Документация:** https://docs.railway.app
- **GitHub Интеграция:** https://docs.railway.app/deploy/github
- **Environment Variables:** https://docs.railway.app/reference/variables
- **MongoDB:** https://docs.railway.app/databases/mongodb
- **Status Page:** https://railway-app.statuspage.io

---

## 🎯 БЫСТРЫЙ ЧЕКСЛИСТ

- [ ] GitHub репо создан и залит код
- [ ] Railway аккаунт создан
- [ ] Backend сервис добавлен (Root: backend)
- [ ] Frontend сервис добавлен (Root: frontend)
- [ ] MongoDB добавлена
- [ ] Backend переменные установлены (включая MONGODB_URI)
- [ ] Frontend переменные установлены (REACT_APP_API_URL)
- [ ] Seed данные загружены (npm run seed)
- [ ] Frontend доступен на https://...
- [ ] Логин работает (admin@example.com / admin123)
- [ ] API endpoints работают

---

## 💡 СОВЕТЫ RAILWAY

1. **Используйте Railway CLI для локального тестирования:**
   ```bash
   railway link  # Подключиться к проекту
   railway up    # Смотреть логи
   ```

2. **Смотрите логи deployment:**
   - В Railway UI → Выберите сервис → Logs tab

3. **Переменные окружения меняются сразу:**
   - Нет нужно пересоздавать сервис
   - Railroad автоматически перестартует контейнер

4. **GitHub интеграция:**
   - Коммиты в main ветку → автоматический deploy
   - PR preview для тестирования

---

## 🚀 ГОТОВО К DEPLOYMENT!

Следуйте шагам выше и ваша система будет работать на Railway за 30 минут! 

### Если что-то не понятно:
- Смотрите логи в Railway UI (Logs tab)
- Читайте официальную документацию: https://docs.railway.app
- Проверяйте переменные окружения (все ли правильные?)

---

**Платформа:** Railway.app  
**Версия:** 1.0.0  
**Статус:** ✅ Ready to Deploy  
**Дата:** Апрель 2026

🚈 **ВСЕ ЯСНО? НАЧИНАЙТЕ DEPLOYMENT!** 🚀
