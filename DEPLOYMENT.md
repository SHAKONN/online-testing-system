# 🌍 DEPLOYMENT GUIDE - Развертывание на Серверах/Облаке

## 📋 ОПЦИИ РАЗВЕРТЫВАНИЯ:

---

## **ВАРИАНТ 1️⃣: HEROKU (Самый простой) ⭐⭐⭐**

### Шаг 1: Установите Heroku CLI
```bash
brew install heroku
heroku login
```

### Шаг 2: Создайте приложения
```bash
# Backend
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system/backend
heroku create your-app-backend
heroku addons:create mongolab  # MongoDB в облаке

# Frontend (2-й способ)
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system/frontend
heroku create your-app-frontend
```

### Шаг 3: Настройте переменные окружения
```bash
# Backend
heroku config:set JWT_SECRET="your-secret-key" --app your-app-backend
heroku config:set MONGODB_URI="mongodb+srv://..." --app your-app-backend
heroku config:set NODE_ENV=production --app your-app-backend
```

### Шаг 4: Deploy
```bash
# Backend
cd backend
git push heroku main

# Frontend
cd frontend
git push heroku main
```

✅ **Frontend доступен:** https://your-app-frontend.herokuapp.com
✅ **Backend доступен:** https://your-app-backend.herokuapp.com/api

---

## **ВАРИАНТ 2️⃣: RAILWAY.APP (Рекомендуется) ⭐⭐⭐⭐**

### Шаг 1: Создайте проект
1. Перейдите на https://railway.app
2. Нажмите "New Project" → "GitHub Repo"
3. Выберите ваш репозиторий

### Шаг 2: Добавьте сервисы
```
Project Settings →
  Backend Service (Node.js, port 5001)
  Frontend Service (Node.js, port 3000)
  MongoDB (from marketplace)
```

### Шаг 3: Установите переменные
```bash
# Backend
JWT_SECRET=your-secret
NODE_ENV=production
MONGODB_URI=${{MONGO_CONNECTION_STRING}}
FRONTEND_URL=https://your-frontend.railway.app
PORT=5001
```

### Шаг 4: Deploy автоматический (git push)
```bash
git push origin main
```

✅ **Автоматический deployment!**

---

## **ВАРИАНТ 3️⃣: RENDER.COM (Бесплатный хостинг) ⭐⭐⭐**

### Шаг 1: Создайте аккаунт
https://render.com (Free tier доступен!)

### Шаг 2: Создайте Web Services
```
New → Web Service → GitHub Repo

Backend:
  Build: npm install
  Start: npm start (или npm run dev)
  Environment: production
  Port: 5001

Frontend:
  Build: npm run build
  Start: npm start
  Environment: production
  Port: 3000
```

### Шаг 3: Добавьте MongoDB
```
New → MongoDB Service
```

### Шаг 4: Автоматический deploy
Все commits в main автоматически деплойтся!

---

## **ВАРИАНТ 4️⃣: AWS (Для большого масштаба) ⭐⭐⭐⭐⭐**

### Требуемые сервисы:
```
AWS EC2     - Сервер для Backend
S3 + CloudFront - Хостинг Frontend
RDS MongoDB - Управляемая база данных
```

### Инструкции:
1. Создайте EC2 инстанс (Ubuntu 20.04)
2. SSH подключитесь
3. Установите Node.js и Docker
4. Deploy project
5. Настройте CloudFront для Frontend
6. Используйте AWS RDS для MongoDB

---

## **ВАРИАНТ 5️⃣: DIGITALOCEAN (Надежный и доступный) ⭐⭐⭐⭐**

### Шаг 1: Создайте Droplet
```
https://digitalocean.com
Droplet → Ubuntu 20.04 → $5/month
```

### Шаг 2: SSH в сервер
```bash
ssh root@your_server_ip
```

### Шаг 3: Установите зависимости
```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
apt install docker.io docker-compose -y
```

### Шаг 4: Clone и Deploy
```bash
git clone https://github.com/your-username/online-testing-system.git
cd online-testing-system

# Используйте docker-compose для продакшена
docker-compose -f docker-compose.prod.yml up -d
```

### Шаг 5: Nginx как reverse proxy
```bash
apt install nginx -y
# Конфигурируйте /etc/nginx/sites-available/default
```

---

## **ВАРИАНТ 6️⃣: GITHUB PAGES (Только Frontend) ⭐**

Для frontend статического деплоя:

### Шаг 1: Build
```bash
cd frontend
npm run build
```

### Шаг 2: Deploy на GitHub Pages
```bash
npm install --save-dev gh-pages
```

Добавьте в package.json:
```json
{
  "homepage": "https://your-username.github.io/online-testing-system",
  "scripts": {
    "deploy": "gh-pages -d build"
  }
}
```

### Шаг 3: Deploy
```bash
npm run deploy
```

---

## 🐳 **DOCKER PRODUCTION SETUP**

### Создайте docker-compose.prod.yml:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      NODE_ENV: production
      PORT: 5001
      MONGODB_URI: ${MONGODB_URI}
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
    depends_on:
      - mongodb
    networks:
      - app-network

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: ${BACKEND_URL}/api
    networks:
      - app-network

  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: testing-system
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

volumes:
  mongodb_data:

networks:
  app-network:
    driver: bridge
```

### Запуск:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📝 **PRODUCTION .env ФАЙЛЫ**

### Backend .env.production:
```
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/testing-system?retryWrites=true
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRE=30d
FRONTEND_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
```

### Frontend .env.production:
```
REACT_APP_API_URL=https://api.your-domain.com/api
```

---

## 🔒 **БЕЗОПАСНОСТЬ НА ПРОДАКШЕНЕ**

1. **HTTPS:** Всегда используйте SSL сертификаты (Let's Encrypt бесплатно)
2. **CORS:** Ограничьте домены в backend
3. **Rate Limiting:** Добавьте защиту от brute-force
4. **Валидация:** Проверяйте все входные данные
5. **Логирование:** Логируйте все действия
6. **Backups:** Регулярно делайте бэкапы БД

---

## 🚀 **ПОШАГОВЫЙ ГАЙД: RENDER.COM (САМЫЙ ПРОСТОЙ)**

### Шаг 1: Подготовка кода
```bash
# Убедитесь что код в GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Шаг 2: Создайте .env файлы (секретные)
НЕ загружайте .env в GitHub! Используйте переменные в UI.

### Шаг 3: На render.com создайте:

**Backend Web Service:**
```
Repository: your-repo
Branch: main
Root Directory: backend
Build: npm install
Start: npm start (добавьте в backend package.json!)
Environment:
  NODE_ENV=production
  PORT=5001
  JWT_SECRET=your-secret
  MONGODB_URI=mongodb+srv://...
  FRONTEND_URL=https://your-frontend.onrender.com
```

**Frontend Web Service:**
```
Repository: your-repo
Branch: main
Root Directory: frontend
Build: npm run build
Start: npm start
Environment:
  REACT_APP_API_URL=https://your-backend.onrender.com/api
```

**MongoDB:**
```
From Marketplace
```

### Шаг 4: Deploy
```bash
git push origin main
# Render автоматически деплойт!
```

✅ Готово!

---

## 📊 **СРАВНЕНИЕ ПЛАТФОРМ**

| Платформа | Стоимость | Сложность | Простота |
|-----------|-----------|---------|---------|
| **Heroku** | $7/месяц | ⭐ | ⭐⭐⭐ |
| **Railway** | $5/месяц | ⭐ | ⭐⭐⭐⭐ |
| **Render** | $0 (free tier) | ⭐ | ⭐⭐⭐⭐ |
| **DigitalOcean** | $5/месяц | ⭐⭐ | ⭐⭐⭐ |
| **AWS** | Переменная | ⭐⭐⭐⭐ | ⭐ |
| **GitHub Pages** | $0 | ⭐ | ⭐⭐⭐ |

---

## 🎯 **РЕКОМЕНДАЦИЯ:**

### Для быстрого старта: **RENDER.COM** ✨
- Бесплатный tier
- Автоматический deployment
- MongoDB в одном клике
- HTTPS по умолчанию

### Для продакшена: **RAILWAY.APP** или **DIGITALOCEAN**
- Надежность
- Гибкость
- Хорошая поддержка

---

## 📚 **ПОЛЕЗНЫЕ КОМАНДЫ:**

```bash
# Build для production
npm run build

# Проверка ambiente
npm run env

# Оптимизировать
npm run optimize

# Логирование
npm run logs
```

---

## 🔗 **ПОЛЕЗНЫЕ ССЫЛКИ:**

- **Heroku:** https://heroku.com
- **Railway:** https://railway.app
- **Render:** https://render.com
- **DigitalOcean:** https://digitalocean.com
- **AWS:** https://aws.amazon.com
- **MongoDB Atlas:** https://mongodb.com/cloud/atlas

---

## ✅ СЛЕДУЮЩИЕ ШАГИ:

1. **Выберите платформу** из списка выше
2. **Подготовьте код** (убедитесь что в GitHub)
3. **Следуйте инструкциям** для вашей платформы
4. **Настройте переменные окружения**
5. **Deploy!**

**Вопросы? Комментарии? Пишите!** 💬

---

**Версия:** 1.0.0  
**Дата:** Апрель 2026  
**Статус:** Ready for Production ✅
