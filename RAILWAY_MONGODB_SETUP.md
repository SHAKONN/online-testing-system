# 🗄️ ДОБАВЛЯЕМ MONGODB НА RAILWAY

## 📍 ВЫ ЗДЕСЬ:
Railway Dashboard открыт в браузере  
👉 https://railway.app/dashboard

---

## 🎯 ШАГ 1: ОТКРОЙТЕ ПРОЕКТ

1. На экране Railway найдите свой проект: **"online-testing-system"**
2. **Нажмите на него**

---

## 🎯 ШАГ 2: ДОБАВЬТЕ SERVICE

В проекте нажмите большую кнопку:

```
[+ Add Service]  или  [+ New]
```

Это кнопка в центре экрана или вверху справа.

---

## 🎯 ШАГ 3: ВЫБЕРИТЕ MONGODB

Выпадающее меню:

```
Marketplace
    ↓
MongoDB
    ↓
[Create]
```

**Или** напрямую кликните: **"Marketplace"** → **"MongoDB"**

---

## 🎯 ШАГ 4: СОЗДАЙТЕ БАЗУ

Форма MongoDB:

```
Database name: testing-system
Root password: (Railway генерирует автоматически)

[Create MongoDB Instance]  ← нажмите
```

---

## 🎯 ШАГ 5: ЖДИТЕ (2-3 МИНУТЫ)

Railway создаёт базу данных:

```
✓ Creating MongoDB instance...
✓ Connecting...
✓ Ready! ✅
```

Вы видите новый сервис "mongodb" в проекте!

---

## 🎯 ШАГ 6: СКОПИРУЙТЕ DATABASE_URL

1. Кликните на **"mongodb"** сервис (в левой панели)
2. Откройте вкладку **"Variables"**
3. Найдите: **`DATABASE_URL`**
4. Скопируйте полное значение (оно начинается на `mongodb+srv://`)

---

## 🎯 ШАГ 7: УСТАНОВИТЕ ПЕРЕМЕННЫЕ В BACKEND

1. Кликните на **backend сервис** (левая панель)
2. Откройте вкладку **"Variables"**
3. Добавьте переменные:

```
NODE_ENV          = production
PORT              = 5001
JWT_SECRET        = super-secret-key-change-in-production-please
DATABASE_URL      = (вставьте скопированное значение из шага 6)
```

**Как добавить переменную:**
- Нажмите **"Add Variable"**
- Напишите ключ (например: NODE_ENV)
- Напишите значение (например: production)
- Нажмите **"+" или "Save"**

---

## 🎯 ШАГ 8: СОХРАНИТЕ И ЖДИТЕ

После добавления переменных:

```
✓ Variables saved
✓ Backend перезагружается...
✓ Connect to MongoDB...
✓ Ready! ✅
```

---

## ✅ КАК ПРОВЕРИТЬ ЧТО РАБОТАЕТ:

1. Кликните на **backend сервис**
2. Откройте вкладку **"Deploy Logs"**
3. Ищите строку:

```
✅ MongoDB подключена: [сервер]
```

Если видите эту строку - **УСПЕХ!** 🎉

---

## 🚨 ЕСЛИ ОШИБКА:

### Ошибка: "Cannot connect to database"
```
→ Проверьте что DATABASE_URL правильно скопирована
→ Убедитесь что MongoDB сервис ACTIVE (зелёный)
→ Перезагрузите backend: Settings → Redeploy
```

### Ошибка: "MongoServerError"
```
→ Ждите! MongoDB может грузиться 2-3 минуты
→ Проверьте логи MongoDB: кликните на "mongodb" сервис
```

---

## 📊 ПОСЛЕ УСПЕШНОГО ПОДКЛЮЧЕНИЯ:

```
online-testing-system (PROJECT)
├─ backend     ✅ (Connected to MongoDB)
├─ frontend    ⭕ (Next: add routing)
└─ mongodb     ✅ (Active and running)
```

---

## 🎯 ДАЛЬШЕ:

После того как backend ACTIVE:

1. Добавьте **Frontend** сервис (тот же процесс)
2. Установите переменные Frontend:
   ```
   REACT_APP_API_URL = https://[backend-url].railway.app/api
   ```
3. Ждите пока Frontend ACTIVE
4. Откройте Frontend ссылку и тестируйте! 🚀

---

## 💡 ПОЛЕЗНЫЕ ССЫЛКИ:

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- MongoDB Template: https://railway.app/templates/mongodb

---

**Готовы? Начните со ШАГ 1!** 👉

