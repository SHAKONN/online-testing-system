# 🗄️ Схема базы данных - Online Testing System

## Диаграмма связей (Entity Relationship Diagram)

```
┌─────────────────┐         ┌──────────────────┐
│     User        │         │    Question      │
├─────────────────┤         ├──────────────────┤
│ _id (PK)        │◄────────│ _id (PK)         │
│ name            │         │ text             │
│ email (unique)  │         │ category         │
│ password        │         │ difficulty       │
│ role            │         │ options[]        │
│ totalTests      │         │ correctAnswerIdx │
│ averageScore    │         │ explanation      │
│ createdAt       │         │ createdBy (FK)──┐│
│ updatedAt       │         │ createdAt       ││
└─────────────────┘         └──────────────────┘│
         ▲                           ▲            │
         │                           │            │
    ┌────┴────────┬──────────────┐   │            │
    │             │              │   │            │
┌───┴──────────┐  │    ┌─────────┴───┴────────┐  │
│   Result     │  │    │      Test           │  │
├──────────────┤  │    ├─────────────────────┤  │
│ _id (PK)     │◄─┴────│ _id (PK)            │  │
│ user (FK)    │       │ title               │  │
│ test (FK────┐│       │ description         │  │
│ category    ││       │ category            │  │
│ answers[]   ││       │ timeLimit           │  │
│ score       ││       │ questionCount       │  │
│ percentage  ││       │ questions[] (FK───┐ │  │
│ totalQuests ││       │ totalAttempts     │ │  │
│ correctly   ││       │ averageScore      │ │  │
│ timeSpent   ││       │ isActive          │ │  │
│ startedAt   ││       │ createdBy (FK────┐│ │  │
│ submittedAt ││       │ createdAt        ││ │  │
└──────────────┘│       └──────────────────┘│ │  │
               │             ▲               │ │  │
               │             │               │ │  │
               └─────────────┴───────────────┘ │  │
                             │                 │  │
                             └──────────┬──────┘  │
                                        └─────────┘
```

---

## 📋 Полная схема коллекций

### 1. **Users** (Пользователи)

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Иван Иванов",
  email: "ivan@example.com",
  password: "$2a$10$...", // bcrypt хеш
  role: "user", // "user" или "admin"
  totalTests: 15,
  averageScore: 78.5,
  createdAt: ISODate("2026-04-01T10:30:00Z"),
  updatedAt: ISODate("2026-04-10T15:45:00Z")
}
```

**Индексы:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
```

**Описание полей:**
| Поле | Тип | Описание | Требуется |
|--------|---------|------|----------|
| _id | ObjectId | Уникальный ID | ✓ |
| name | String | Полное имя пользователя | ✓ |
| email | String | Email (уникальный) | ✓ |
| password | String | Хешированный пароль | ✓ |
| role | String | "user" или "admin" | ✓ |
| totalTests | Number | Всего пройдено тестов | ✗ |
| averageScore | Number | Средний процент | ✗ |
| createdAt | Date | Дата создания | ✓ |
| updatedAt | Date | Дата обновления | ✓ |

---

### 2. **Questions** (Вопросы)

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  text: "Чему равно 2 + 2?",
  category: "Математика",
  difficulty: "easy", // "easy", "medium", "hard"
  options: [
    {
      text: "3",
      isCorrect: false
    },
    {
      text: "4",
      isCorrect: true
    },
    {
      text: "5",
      isCorrect: false
    },
    {
      text: "6",
      isCorrect: false
    }
  ],
  correctAnswerIndex: 1,
  explanation: "2 + 2 = 4 по правилам арифметики",
  createdBy: ObjectId("507f1f77bcf86cd799439011"),
  createdAt: ISODate("2026-03-15T08:00:00Z"),
  updatedAt: ISODate("2026-04-05T12:30:00Z")
}
```

**Индексы:**
```javascript
db.questions.createIndex({ category: 1 })
db.questions.createIndex({ difficulty: 1 })
db.questions.createIndex({ createdBy: 1 })
```

**Описание полей:**
| Поле | Тип | Описание | Требуется |
|--------|---------|------|----------|
| _id | ObjectId | Уникальный ID | ✓ |
| text | String | Текст вопроса | ✓ |
| category | String | Предмет/категория | ✓ |
| difficulty | String | Уровень сложности | ✓ |
| options | Array | Массив вариантов ответа | ✓ |
| options[].text | String | Текст варианта | ✓ |
| options[].isCorrect | Boolean | Правильный ли ответ | ✓ |
| correctAnswerIndex | Number | Индекс правильного ответа | ✓ |
| explanation | String | Объяснение ответа | ✗ |
| createdBy | ObjectId | ID автора (ref: User) | ✓ |
| createdAt | Date | Дата создания | ✓ |
| updatedAt | Date | Дата обновления | ✓ |

**Валидация:**
- `options` должен содержать ровно 4 элемента
- Один из элементов должен быть `isCorrect: true`
- `correctAnswerIndex` должен быть 0-3

---

### 3. **Tests** (Тесты)

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  title: "Тест по Математике",
  description: "Проверка базовых знаний арифметики и алгебры",
  category: "Математика",
  timeLimit: 30, // в минутах
  questionCount: 10,
  questions: [
    ObjectId("507f1f77bcf86cd799439012"),
    ObjectId("507f1f77bcf86cd799439013"),
    // ...
  ],
  totalAttempts: 45,
  averageScore: 72.5,
  isActive: true,
  createdBy: ObjectId("507f1f77bcf86cd799439001"),
  createdAt: ISODate("2026-03-01T09:00:00Z"),
  updatedAt: ISODate("2026-04-10T14:00:00Z")
}
```

**Индексы:**
```javascript
db.tests.createIndex({ category: 1 })
db.tests.createIndex({ isActive: 1 })
db.tests.createIndex({ createdBy: 1 })
```

**Описание полей:**
| Поле | Тип | Описание | Требуется |
|--------|---------|------|----------|
| _id | ObjectId | Уникальный ID | ✓ |
| title | String | Название теста | ✓ |
| description | String | Описание | ✗ |
| category | String | Категория/предмет | ✓ |
| timeLimit | Number | Время на тест (минуты) | ✓ |
| questionCount | Number | Количество вопросов | ✓ |
| questions | Array<ObjectId> | ID вопросов (ref: Question) | ✓ |
| totalAttempts | Number | Всего попыток | ✓ |
| averageScore | Number | Средний результат (%) | ✓ |
| isActive | Boolean | Активен ли тест | ✓ |
| createdBy | ObjectId | ID создателя (ref: User) | ✓ |
| createdAt | Date | Дата создания | ✓ |
| updatedAt | Date | Дата обновления | ✓ |

**Связь:**
- `questions` содержит IDs из коллекции `questions`
- `createdBy` указывает на admin пользователя

---

### 4. **Results** (Результаты тестирования)

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439014"),
  user: ObjectId("507f1f77bcf86cd799439011"),
  test: ObjectId("507f1f77bcf86cd799439013"),
  category: "Математика",
  answers: [
    {
      questionId: ObjectId("507f1f77bcf86cd799439012"),
      selectedAnswerIndex: 1,
      isCorrect: true,
      questionText: "Чему равно 2 + 2?"
    },
    {
      questionId: ObjectId("507f1f77bcf86cd799439015"),
      selectedAnswerIndex: 2,
      isCorrect: false,
      questionText: "Какой логарифм основания 10 от 100?"
    },
    // ... остальные ответы
  ],
  score: 8, // количество правильных ответов
  percentage: 80,
  totalQuestions: 10,
  correctAnswers: 8,
  timeSpent: 1200, // в секундах = 20 минут
  startedAt: ISODate("2026-04-10T14:00:00Z"),
  submittedAt: ISODate("2026-04-10T14:20:00Z"),
  createdAt: ISODate("2026-04-10T14:20:00Z"),
  updatedAt: ISODate("2026-04-10T14:20:00Z")
}
```

**Индексы:**
```javascript
db.results.createIndex({ user: 1, test: 1 })
db.results.createIndex({ user: 1 })
db.results.createIndex({ submittedAt: -1 })
db.results.createIndex({ category: 1 })
```

**Описание полей:**
| Поле | Тип | Описание | Требуется |
|--------|---------|------|----------|
| _id | ObjectId | Уникальный ID | ✓ |
| user | ObjectId | ID пользователя (ref: User) | ✓ |
| test | ObjectId | ID теста (ref: Test) | ✓ |
| category | String | Категория теста | ✓ |
| answers | Array | Массив ответов | ✓ |
| answers[].questionId | ObjectId | ID вопроса | ✓ |
| answers[].selectedAnswerIndex | Number | Выбранный вариант (0-3) | ✓ |
| answers[].isCorrect | Boolean | Правильный ли ответ | ✓ |
| answers[].questionText | String | Текст вопроса | ✓ |
| score | Number | Количество правильных ответов | ✓ |
| percentage | Number | Процент правильности | ✓ |
| totalQuestions | Number | Всего вопросов в тесте | ✓ |
| correctAnswers | Number | Количество правильных ответов | ✓ |
| timeSpent | Number | Затрачено времени (секунды) | ✓ |
| startedAt | Date | Когда начат тест | ✓ |
| submittedAt | Date | Когда завершен тест | ✓ |
| createdAt | Date | Дата создания записи | ✓ |
| updatedAt | Date | Дата обновления | ✓ |

---

## 🔗 Связи между коллекциями

### Связь User → Question (One-to-Many)
```
User (_id) ─────1──→ n←───── Question (createdBy: User._id)
```
Один пользователь (admin) создает много вопросов.

### Связь User → Test (One-to-Many)
```
User (_id) ─────1──→ n←───── Test (createdBy: User._id)
```
Один пользователь (admin) создает много тестов.

### Связь Test ⟷ Question (Many-to-Many)
```
Test (questions: [Question._id]) ←─────→ Questions
```
Один тест содержит много вопросов. Один вопрос может быть в разных тестах.

### Связь User → Result (One-to-Many)
```
User (_id) ─────1──→ n←───── Result (user: User._id)
```
Один пользователь имеет много результатов.

### Связь Test → Result (One-to-Many)
```
Test (_id) ─────1──→ n←───── Result (test: Test._id)
```
Один тест имеет много результатов от разных пользователей.

---

## 📊 Примеры запросов

### Получить все вопросы пользователя:
```javascript
db.questions.find({ createdBy: ObjectId("507f1f77bcf86cd799439001") })
```

### Получить результаты пользователя:
```javascript
db.results.find({ user: ObjectId("507f1f77bcf86cd799439011") }).sort({ submittedAt: -1 })
```

### Получить среднюю оценку по категории:
```javascript
db.results.aggregate([
  { $match: { category: "Математика" } },
  { $group: { _id: null, avgScore: { $avg: "$percentage" } } }
])
```

### Получить самые неудачные вопросы:
```javascript
db.results.aggregate([
  { $unwind: "$answers" },
  { $match: { "answers.isCorrect": false } },
  { $group: { _id: "$answers.questionId", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
])
```

### Получить лидерборд:
```javascript
db.users.find({ role: "user" })
  .sort({ averageScore: -1 })
  .limit(50)
```

---

## 🔒 Правила целостности данных

1. **Foreign Key Constraints:**
   - `Question.createdBy` должен существовать в `User._id`
   - `Test.createdBy` должен существовать в `User._id`
   - `Test.questions[]` должны существовать в `Question._id`
   - `Result.user` должен существовать в `User._id`
   - `Result.test` должен существовать в `Test._id`
   - `Result.answers[].questionId` должен существовать в `Question._id`

2. **Data Validation:**
   - Все email должны быть уникальными
   - `role` может быть только "user" или "admin"
   - `difficulty` может быть только "easy", "medium" или "hard"
   - `options` должен содержать ровно 4 элемента
   - `correctAnswerIndex` должен быть 0-3
   - `percentage` должен быть 0-100

3. **Business Rules:**
   - Могут редактировать вопросы и тесты только создатели или администраторы
   - Пользователь может видеть только свои результаты
   - Результаты не могут быть удалены (только администратором при необходимости)

---

## 📈 Оптимизация запросов

### Рекомендованные индексы:
```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })

// Questions
db.questions.createIndex({ category: 1 })
db.questions.createIndex({ difficulty: 1 })
db.questions.createIndex({ createdBy: 1 })

// Tests
db.tests.createIndex({ category: 1 })
db.tests.createIndex({ isActive: 1 })
db.tests.createIndex({ createdBy: 1 })

// Results
db.results.createIndex({ user: 1, test: 1 })
db.results.createIndex({ user: 1 })
db.results.createIndex({ submittedAt: -1 })
db.results.createIndex({ category: 1 })
```

### Сложные запросы с aggregation:
```javascript
// Получить полную информацию о результатах с деталями
db.results.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "userData"
    }
  },
  {
    $lookup: {
      from: "tests",
      localField: "test",
      foreignField: "_id",
      as: "testData"
    }
  },
  { $sort: { submittedAt: -1 } },
  { $limit: 100 }
])
```

---

## 🔄 Миграция данных

Если нужно изменить структуру:

```javascript
// Добавить новое поле ко всем документам
db.users.updateMany({}, { $set: { newField: defaultValue } })

// Удалить поле из всех документов
db.users.updateMany({}, { $unset: { oldField: "" } })

// Переименовать поле
db.users.updateMany({}, { $rename: { oldName: "newName" } })
```

---

**Версия схемы:** 1.0  
**Дата обновления:** Апрель 2026
