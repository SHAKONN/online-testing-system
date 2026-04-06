# ⚡ БЫСТРЫЙ ГАЙД ПО DEPLOYMENT

## 🚀 ТРИ СПОСОБА (выберите один):

---

## **СПОСОБ 1: RENDER.COM (РЕКОМЕНДУЕТСЯ) ⭐⭐⭐⭐⭐**

**Самый простой! Бесплатный tier доступен!**

### Шаг 1️⃣: Подготовьте GitHub репозиторий
```bash
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system

# Если еще нет git
git init
git add .
git commit -m "Initial commit"

# Создайте репозиторий на GitHub и push
git remote add origin https://github.com/YOUR-USERNAME/online-testing-system.git
git push -u origin main
```

### Шаг 2️⃣: Откройте https://render.com
- Нажмите "New +"
- Выберите "Web Service"
- Подключите GitHub репозиторий
- Выберите основную ветку (main)

### Шаг 3️⃣: Создайте Backend сервис
```
Repository: online-testing-system
Branch: main
Runtime: Node
Build Command: cd backend && npm install
Start Command: cd backend && npm start
Environment:
  NODE_ENV=production
  PORT=5001
  JWT_SECRET=your-secret-key-min-32-chars
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/testing-system
  FRONTEND_URL=https://your-frontend.onrender.com
```

### Шаг 4️⃣: Создайте Frontend сервис
```
Repository: online-testing-system
Branch: main
Runtime: Node
Build Command: cd frontend && npm install && npm run build && npm install -g serve
Start Command: cd frontend && serve -s build -l 3000
Environment:
  REACT_APP_API_URL=https://your-backend.onrender.com/api
```

### Шаг 5️⃣: Добавьте MongoDB
```
From Marketplace → MongoDB
```

### Шаг 6️⃣: Deploy
```bash
git push origin main
```

✅ **Готово! Автоматический deploy при каждом коммите!**

---

## **СПОСОБ 2: HEROKU (Классический) ⭐⭐⭐**

### Установите Heroku CLI
```bash
brew install heroku
heroku login
```

### Создайте приложения
```bash
# Backend
heroku create your-app-backend
heroku addons:create mongolab --app your-app-backend

# Frontend
heroku create your-app-frontend
```

### Настройте переменные
```bash
heroku config:set JWT_SECRET="your-key" --app your-app-backend
heroku config:set MONGODB_URI="mongodb+srv://..." --app your-app-backend
```

### Deploy
```bash
# Backend
cd backend && git push heroku main

# Frontend
cd frontend && git push heroku main
```

✅ **Frontend:** https://your-app-frontend.herokuapp.com
✅ **Backend:** https://your-app-backend.herokuapp.com/api

---

## **СПОСОБ 3: DOCKER COMPOSE (Универсальный) ⭐⭐⭐⭐**

### На вашем сервере:

#### Шаг 1: Клонируйте проект
```bash
git clone https://github.com/YOUR-USERNAME/online-testing-system.git
cd online-testing-system
```

#### Шаг 2: Создайте .env файл для production
```bash
cat > .env.prod << 'EOF'
# MongoDB
MONGO_USER=admin
MONGO_PASSWORD=change-this-password

# Backend
JWT_SECRET=your-super-secret-key-change-this-min-32-chars
FRONTEND_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
MONGODB_URI=mongodb://admin:change-this-password@mongodb:27017/testing-system?authSource=admin

# Backend URL
BACKEND_URL=https://api.your-domain.com
EOF
```

#### Шаг 3: Build и запустите
```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### Шаг 4: Проверка
```bash
docker-compose -f docker-compose.prod.yml ps
curl http://localhost:5001
curl http://localhost:3000
```

✅ **Готово! Система работает в Docker и готова к production!**

---

## 🔒 **PRODUCTION SECURITY CHECKLIST**

### Перед деплоем:
- [ ] Измените JWT_SECRET на новое значение
- [ ] Измените пароль MongoDB
- [ ] Установите HTTPS (Let's Encrypt)
- [ ] Настройте CORS для вашего домена
- [ ] Добавьте MONGODB_URI для Atlas/облачного сервиса
- [ ] Выключите CORS в dev режиме
- [ ] Закройте доступ к mongoDB порту (27017)
- [ ] Используйте переменные окружения вместо hardcode
- [ ] Установите rate limiting на API
- [ ] Включите логирование и мониторинг

---

## 🔧 **ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (обязательные)**

### Backend:
```
NODE_ENV=production
PORT=5001
JWT_SECRET=your-secret-key-min-32-characters
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
FRONTEND_URL=https://your-frontend.com
CORS_ORIGIN=https://your-frontend.com
```

### Frontend:
```
REACT_APP_API_URL=https://api.your-domain.com/api
```

---

## 📊 **СТОИМОСТЬ (на примере RENDER.COM)**

```
Backend Service:     $7/месяц
Frontend Service:    $7/месяц
MongoDB Database:    бесплатно
Итого:               $14/месяц

Альтернатива: Heroku = $7-14/месяц
Альтернатива: Railway = $5-10/месяц
Альтернатива: DigitalOcean = $5/месяц
```

---

## 🆘 **ПРОБЛЕМЫ И РЕШЕНИЯ**

### Ошибка "Cannot find module"
```bash
# Проверьте что npm install выполнен
npm install

# Очистите кэш
npm cache clean --force
npm install
```

### Port уже используется
```bash
# Используйте другой port в .env
PORT=5002
```

### MongoDB не подключается
```bash
# Проверьте MONGODB_URI
# В облачном MongoDB (Atlas) убедитесь что:
# - IP внесен в whitelist
# - Пароль правильный
# - Connection string правильный
```

### Frontend не видит Backend
```bash
# Убедитесь что REACT_APP_API_URL правильный
# Проверьте CORS в backend
```

---

## 📁 **ФАЙЛЫ ДЛЯ DEPLOYMENT**

`✅ Уже созданы для вас:`

| Файл | Назначение |
|------|-----------|
| **Dockerfile** (backend & frontend) | Docker образы |
| **docker-compose.prod.yml** | Production оркестрация |
| **.github/workflows/deploy.yml** | CI/CD pipeline |
| **DEPLOYMENT.md** | Полный гайд |

---

## ✨ **МОЙ СОВЕТ:**

### Для быстрого старта:
**1. RENDER.COM** - Просто git push и готово! ⭐

## Для надежности:
**2. RAILWAY.APP** или **DIGITALOCEAN** - Better control и мониторинг

## Для масштабирования:
**3. AWS** или **GCP** - Полный контроль и масштабируемость

---

## 🎯 **FINAL CHECKLIST**

- [ ] Код в GitHub
- [ ] .env файлы подготовлены (но НЕ в GitHub!)
- [ ] Выбрали платформу (Render/Heroku/Docker)
- [ ] Создали MongoDB (облачное или local)
- [ ] Настроили переменные окружения
- [ ] Настроили HTTPS и домены
- [ ] Проверили логины (admin@example.com / admin123)
- [ ] Загрузили тестовые данные (npm run seed)
- [ ] Протестировали API (curl или Postman)
- [ ] Включили логирование и мониторинг

---

## 🚀 ГОТОВО К ДЕПЛОЮ!

Выбирайте способ и следуйте инструкциям выше! 💪

**Вопросы? Смотрите [DEPLOYMENT.md](./DEPLOYMENT.md)** 📖

---

**Создано:** GitHub Copilot  
**Дата:** Апрель 2026  
**Статус:** Ready for Production ✅
