# 🚈 RAILWAY.APP - ДЕТАЛЬНЫЙ ГАЙД С КАРТИНКАМИ/ШАГАМИ

## STEP-BY-STEP INSTRUCTIONS

---

## 📋 ТРЕБОВАНИЯ:

✅ GitHub аккаунт (если нет - создайте)
✅ Ваш код на GitHub
✅ 15 минут времени

---

## 🎯 ПЛАН DEPLOYMENT:

```
GitHub Repo
    ↓
Railway Project
    ├── Backend Service
    ├── Frontend Service
    └── MongoDB Database
         ↓
    Ready to Use!
```

---

## 🔴 STEP 1: Подготовьте GitHub репозиторий

### Если у вас ЕЩЕ НЕТ GitHub репо:

1. **Создайте новый репо на GitHub.com:**
   ```
   Откройте: https://github.com/new
   Название: online-testing-system
   Описание: Online Testing System
   Private или Public (ваше решение)
   НЕ инициализируйте README, .gitignore, License
   Нажмите: "Create repository"
   ```

2. **Загрузьте код:**
   ```bash
   cd /Users/zhumazhanb/Desktop/diploma/online-testing-system
   
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/online-testing-system.git
   git push -u origin main
   ```

3. **Проверьте:**
   - Откройте https://github.com/YOUR-USERNAME/online-testing-system
   - Вы должны видеть все файлы (backend, frontend, .md файлы)

✅ **GitHub готов!**

---

## 🟠 STEP 2: Создайте Railway аккаунт

1. **Откройте:** https://railway.app
2. **Нажмите:** "Start a new project" или "Sign up"
3. **Выберите:** "Continue with GitHub"
4. **Авторизуйте:** Railway в GitHub
5. **Дайте доступ** к вашему репо `online-testing-system`

✅ **Аккаунт создан!**

---

## 🟡 STEP 3: Создайте новый Railway проект

```
После авторизации вы должны увидеть Dashboard Railway

1. Нажмите кнопку: "New Project" (большая голубая кнопка)
2. Появится меню:
   - Github Repo (Git pull)
   - Create from CLI
   - Deploy from Docker Hub
   - и т.д.
   
3. Выберите: "Deploy from Github Repo"
4. Найдите ваш репо: "online-testing-system"
5. Нажмите на него
6. Нажмите: "Deploy"
```

✅ **Проект создан!**

---

## 🟢 STEP 4: Настройте Backend сервис

### 4.1 Добавьте Backend

```
В вашем Railway проекте:
1. Нажмите кнопку: "+ New" (вверху справа)
2. Выберите: "GitHub Repo"
3. Подтвердите выбор вашего репо
4. Нажмите: "Deploy"
5. Подождите несколько секунд пока Railway распознает структуру
```

### 4.2 Настройте Backend

```
Найдите Backend сервис в проекте
Нажмите на него (назовется что-то вроде "repository" или "service")

Перейдите в настройки (Settings):
  1. Нажмите на иконку шестеренки/Settings
  2. Найдите "Root Directory"
  3. Измените на: backend
  4. Сохраните (Save или нажмите галочку)

Перейдите в Build & Deploy (Settings → Build & Deploy):
  1. Build Command: npm install
  2. Start Command: npm start
  3. Порт: 5001 (должен стоять автоматически)
  4. Сохраните

Перейдите в Variables (Settings → Variables):
  1. Добавьте переменные одну за другой
  2. Нажмите "Add Variable"
```

### 4.3 Переменные Backend

Добавьте эти переменные:

| Ключ | Значение |
|------|----------|
| `NODE_ENV` | `production` |
| `PORT` | `5001` |
| `JWT_SECRET` | `your-super-secret-key-min-32-chars-CHANGEME` |
| `FRONTEND_URL` | `https://{frontend-service-name}.railway.app` |
| `CORS_ORIGIN` | `https://{frontend-service-name}.railway.app` |

**Для MONGODB_URI:**
- Сначала создайте MongoDB (следующий шаг)
- Потом вернетесь и добавите: `${{DATABASE_URL}}/testing-system?retryWrites=true&w=majority`

✅ **Backend готов!**

---

## 🟤 STEP 5: Добавьте MongoDB

```
В вашем Railway проекте:
1. Нажмите кнопку: "+ New" (вверху справа)
2. Выберите: "Database"
3. Выберите: "MongoDB"
4. Нажмите: "Create"
5. Подождите несколько секунд
```

Railway **автоматически** добавит переменную `DATABASE_URL` ко всем сервисам!

✅ **MongoDB готова!**

---

## 🔵 STEP 6: Добавьте Frontend сервис

```
В вашем Railway проекте:
1. Нажмите кнопку: "+ New" (вверху справа)
2. Выберите: "GitHub Repo"
3. Подтвердите выбор вашего репо
4. Нажмите: "Deploy"
```

### 6.2 Настройте Frontend

```
Найдите Frontend сервис
Нажмите на него

Перейдите в Settings:
  1. Root Directory: frontend
  2. Сохраните

Перейдите в Build & Deploy:
  1. Build Command: npm install && npm run build
  2. Start Command: npm start
  3. Порт: 3000 (автоматически)
  4. Сохраните

Перейдите в Variables:
  1. Добавьте переменные
```

### 6.3 Переменные Frontend

Добавьте переменную:

| Ключ | Значение |
|------|----------|
| `REACT_APP_API_URL` | `https://{backend-service-name}.railway.app/api` |

⚠️ **ВАЖНО:** Используйте реальное имя вашего Backend сервиса из Railway!

✅ **Frontend готов!**

---

## 🟣 STEP 7: Запустите deployment

```
После всех настроек:
1. Все сервисы должны начать автоматический deploy
2. Справа у каждого сервиса должна быть строка "Deploying..."
3. Ждите пока все перейдут в "Ready" (зеленый статус)
4. Это может занять 5-15 минут
```

✅ **Deployment идет!**

---

## ⚪ STEP 8: Загрузите тестовые данные

```
После успешного deployment backend:

Вариант 1 - Через Railway CLI:
  1. Установите: npm install -g @railway/cli
  2. railway login
  3. railway link
  4. railway run npm run seed

Вариант 2 - Через GitHub:
  1. Добавьте endpoint /api/seed в backend (если хотите)
  2. Вызовите его после deployment

Вариант 3 - Через REST API:
  curl -X POST https://your-backend.railway.app/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Admin",
      "email": "admin@example.com",
      "password": "admin123"
    }'
```

✅ **Данные загружены!**

---

## 🎨 STEP 9: Получите публичные URL

```
В Railway:
1. Откройте каждый сервис
2. Найдите "URL" или "Public URL" (будет что-то вроде https://...)
3. Скопируйте эти URL

Ваши адреса:
  Frontend: https://{frontend-name}.railway.app
  Backend:  https://{backend-name}.railway.app
  MongoDB:  (закрыта для внешнего доступа - это хорошо!)
```

---

## ✅ STEP 10: Протестируйте систему

### Тест 1: Frontend доступен
```
Откройте браузер: https://your-frontend.railway.app
Вы должны видеть: Экран Login
✅ Если видите - Frontend работает!
```

### Тест 2: Логин работает
```
Введите:
  Email: admin@example.com
  Password: admin123
  
Нажмите: Login
Вы должны увидеть: Dashboard с тестами
✅ Если видите - система работает!
```

### Тест 3: API напрямую
```bash
curl -X POST https://your-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

Вы должны получить:
{"message":"Вход успешен","token":"eyJ...","user":{...}}
✅ Если получите - API работает!
```

---

## 📊 ЛОГИ И ОТЛАДКА

### Смотреть логи:
```
В Railway для каждого сервиса:
1. Нажмите на сервис
2. Перейдите на вкладку "Logs"
3. Вы увидите все логи (красные = ошибки, синие = информация)
```

### Частые ошибки:

| Ошибка | Решение |
|--------|----------|
| `Cannot find module` | Проверьте Root Directory и Build command |
| `MONGODB_URI undefined` | Добавьте переменную `${{DATABASE_URL}}` |
| `Cannot connect to API` | Проверьте REACT_APP_API_URL в frontend |
| `Port already in use` | Railway сам управляет портами - не меняйте |
| `Build timeout` | Увеличьте лимит в Settings → Build |

---

## 🔄 ОБНОВЛЕНИЯ КОДА

После первого успешного deployment:

```bash
# Просто пушьте обновления
git add .
git commit -m "Update feature"
git push origin main

# Railway АВТОМАТИЧЕСКИ:
# 1. Обнаружит новый коммит
# 2. Пересоберет код
# 3. Перезагрузит сервис
# 4. Ваша система обновится!

# Никаких ручных действий не требуется! 🎉
```

---

## 💡 СОВЕТЫ RAILWAY

1. **Переменные меняются мгновенно:**
   - Измените переменную → Railroad автоматически пересоздаст контейнер
   - Никаких ручных перезагрузок не нужно

2. **GitHub интеграция:**
   - Коммиты в main → автоматический deploy
   - PR → preview deployment для проверки

3. **Смотрите меню "Service":**
   - Справа вверху "Service" содержит все опции
   - Database → MongoDB
   - Settings → конфиг
   - Variables → переменные окружения
   - Logs → логи
   - Metrics → использование ресурсов

4. **Удаленный доступ при нужде:**
   ```bash
   railway connect  # Подключиться к БД
   railway shell    # Интерактивная shell
   railway run      # Запустить команду
   ```

---

## 🎆 ВСЕ! ГОТОВО!

После этих шагов ваша система **полностью работает в облаке**! 🎉

```
✅ Frontend на https://...
✅ Backend на https://...
✅ MongoDB в облаке
✅ Автоматический deploy при git push
✅ Логи и мониторинг доступны
✅ HTTPS по умолчанию
✅ Масштабируемость встроена
```

---

## 📚 ССЫЛКИ RAILWAY

- **Главная:** https://railway.app
- **Документация:** https://docs.railway.app
- **GitHub:** https://github.com/railwayapp
- **Статус:** https://status.railway.app
- **Поддержка:** https://railway.app/support

---

**Версия:** 1.0.0  
**Платформа:** Railway.app  
**Статус:** ✅ Ready to Deploy  
**Дата:** Апрель 2026

🚈 **УДАЧИ С DEVELOPMENT НА RAILWAY!** 🚀
