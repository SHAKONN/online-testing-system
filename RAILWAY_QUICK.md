# ⚡ RAILWAY - КРАТКАЯ СПРАВКА (5 минут)

## 🚈 SUPER QUICK DEPLOYMENT

### ШАГ 1: GitHub репо
```bash
cd /Users/zhumazhanb/Desktop/diploma/online-testing-system
git init
git add .
git commit -m "Deploy to Railway"
git remote add origin https://github.com/YOUR-USERNAME/online-testing-system.git
git push -u origin main
```

### ШАГ 2: Railway аккаунт
👉 Откройте https://railway.app → Sign up with GitHub

### ШАГ 3: Новый проект
1. Нажмите "New Project"
2. Выберите "Deploy from GitHub repo"
3. Выберите `online-testing-system`
4. Нажмите "Create"

### ШАГ 4: Добавьте сервисы

**BACKEND:**
- Нажмите "+" → GitHub Repo
- Root Directory: `backend`
- Build: `npm install`
- Start: `npm start`
- Переменные:
  ```
  NODE_ENV=production
  JWT_SECRET=your-secret-key
  FRONTEND_URL=https://{frontend-url}.railway.app
  ```

**FRONTEND:**
- Нажмите "+" → GitHub Repo
- Root Directory: `frontend`
- Build: `npm install && npm run build`
- Start: `npm start`
- Переменные:
  ```
  REACT_APP_API_URL=https://{backend-url}.railway.app/api
  ```

**MONGODB:**
- Нажмите "+" → Database
- Выберите MongoDB
- Create!
- Railway автоматически добавит `DATABASE_URL`
- В Backend используйте: `${{DATABASE_URL}}/testing-system`

### ШАГ 5: Waitlist for deployment
- Railway автоматически деплойтит
- Ждите 5-10 минут

### ШАГ 6: Загрузите данные
```bash
railway login
railway link
railway run npm run seed
```

### ШАГ 7: Тестируйте
- Frontend: https://your-frontend.railway.app
- Backend: https://your-backend.railway.app/api
- Login: admin@example.com / admin123

---

## 🎯 ВСЁ! ГОТОВО! 🚀

Смотрите полный гайд: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
