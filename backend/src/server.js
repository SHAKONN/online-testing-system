// ===== ЗАГРУЖЕНVIE .ENV ДОЛЖНО БЫТЬ ПЕРВЫМ =====
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log(`🔍 NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`🔍 DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);
console.log(`🔍 PORT: ${process.env.PORT}`);

const express = require('express');
const cors = require('cors');
const connectDB = require('../config/database');
const { User, Question, Test } = require('./models');

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const questionRoutes = require('./routes/questionRoutes');
const resultRoutes = require('./routes/resultRoutes');

// Инициализация Express
const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Сервер работает' });
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error('Ошибка:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Внутренняя ошибка сервера',
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

// ===== DATABASE CONNECTION & SERVER START =====
const initializeDatabase = async () => {
  try {
    // Проверяем наличие админа
    const adminCount = await User.countDocuments();
    if (adminCount > 0) {
      console.log('✅ БД уже инициализирована, пропускаем');
      return;
    }

    console.log('🌱 Инициализирую базу данных (пусто, создаю данные)...');

    // Создаем админа
    const admin = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
    await admin.save();
    console.log('✅ Админ создан (admin@example.com / admin123)');

    // Создаем тестовых пользователей
    const users = [];
    for (let i = 1; i <= 5; i++) {
      const user = new User({
        name: `Пользователь ${i}`,
        email: `user${i}@example.com`,
        password: 'password123',
        role: 'user',
      });
      await user.save();
      users.push(user);
    }
    console.log(`✅ ${users.length} тестовых пользователей созданы`);

    // Вопросы в стиле ЕНТ по категориям
    const allQuestions = {
      'Математика': [
        { text: 'Найдите значение выражения: 2³ + 3² - 4', options: ['13', '15', '17', '19'], correct: 0 },
        { text: 'Решите уравнение: 2x + 5 = 15', options: ['x = 5', 'x = 10', 'x = 3', 'x = 7'], correct: 0 },
        { text: 'Какой остаток при делении 27 на 5?', options: ['2', '3', '4', '5'], correct: 1 },
        { text: 'Найдите НОК(12, 18)', options: ['36', '6', '54', '72'], correct: 0 },
        { text: 'Сколько вершин у куба?', options: ['6', '8', '12', '4'], correct: 1 },
      ],
      'Русский язык': [
        { text: 'Укажите правильное написание', options: ['прибежал', 'прибежел', 'приебжал', 'приебжел'], correct: 0 },
        { text: 'Что является подлежащим в предложении "Гроза идет"?', options: ['гроза', 'идет', 'гроза идет', 'идет гроза'], correct: 0 },
        { text: 'В каком слове ударение на последний слог?', options: ['красота', 'дерево', 'книга', 'окно'], correct: 0 },
        { text: 'Найдите словосочетание', options: ['пришел и сел', 'очень быстро', 'он пришел', 'красивый парк'], correct: 3 },
        { text: 'Укажите предложение с однородными членами', options: ['Лес шумит', 'Кот и собака', 'Он пришел и ушел', 'Красивый день'], correct: 2 },
      ],
      'Физика': [
        { text: 'Сколько метров в 1 км?', options: ['100 м', '1000 м', '10000 м', '500 м'], correct: 1 },
        { text: 'Какова скорость света в вакууме?', options: ['300 км/с', '3×10⁸ м/с', '150 км/с', '3×10⁵ км/с'], correct: 1 },
        { text: 'Единица измерения силы', options: ['Джоуль', 'Ватт', 'Ньютон', 'Паскаль'], correct: 2 },
        { text: 'Какая частица имеет положительный заряд?', options: ['электрон', 'протон', 'нейтрон', 'квант'], correct: 1 },
        { text: 'Плотность воды при 4°C', options: ['0.8 г/см³', '1.0 г/см³', '1.2 г/см³', '0.5 г/см³'], correct: 1 },
      ],
      'Химия': [
        { text: 'Какой элемент обозначается Fe?', options: ['Золото', 'Медь', 'Железо', 'Олово'], correct: 2 },
        { text: 'Сколько атомов водорода в молекуле H₂SO₄?', options: ['1', '2', '3', '4'], correct: 2 },
        { text: 'Какой газ необходим для горения?', options: ['Азот', 'Кислород', 'Водород', 'Углекислый газ'], correct: 1 },
        { text: 'pH нейтральной среды', options: ['0', '7', '14', '3.5'], correct: 1 },
        { text: 'Какая кислота содержит азот?', options: ['Серная', 'Азотная', 'Соляная', 'Уксусная'], correct: 1 },
      ],
      'Биология': [
        { text: 'Сколько хромосом у человека?', options: ['23', '46', '48', '44'], correct: 1 },
        { text: 'Какой орган отвечает за расщепление белков?', options: ['печень', 'желудок', 'почки', 'поджелудочная'], correct: 1 },
        { text: 'Сколько камер в сердце человека?', options: ['2', '3', '4', '5'], correct: 2 },
        { text: 'Какой процесс происходит в хлоропластах?', options: ['дыхание', 'брожение', 'фотосинтез', 'разложение'], correct: 2 },
        { text: 'Самая маленькая единица жизни', options: ['молекула', 'клетка', 'ген', 'органелла'], correct: 1 },
      ],
      'История': [
        { text: 'В каком году началась Вторая мировая война?', options: ['1937', '1939', '1941', '1945'], correct: 1 },
        { text: 'Первый президент США', options: ['Т. Джефферсон', 'Дж. Вашингтон', 'А. Линкольн', 'Дж. Кеннеди'], correct: 1 },
        { text: 'Столица Древнего Египта', options: ['Каир', 'Мемфис', 'Фивы', 'Александрия'], correct: 1 },
        { text: 'Год падения Константинополя', options: ['1453', '1453', '1461', '1476'], correct: 0 },
        { text: 'Кто написал Декларацию независимости США?', options: ['Бенджамин Франклин', 'Томас Джефферсон', 'Джордж Вашингтон', 'Самюэл Адамс'], correct: 1 },
      ],
      'География': [
        { text: 'Какая столица России?', options: ['Санкт-Петербург', 'Казань', 'Москва', 'Новосибирск'], correct: 2 },
        { text: 'Самый большой материк', options: ['Африка', 'Европа', 'Азия', 'Северная Америка'], correct: 2 },
        { text: 'Сколько материков?', options: ['5', '6', '7', '8'], correct: 2 },
        { text: 'Самый длинный океан', options: ['Атлантический', 'Тихий', 'Индийский', 'Северный Ледовитый'], correct: 1 },
        { text: 'Столица Казахстана', options: ['Алматы', 'Астана', 'Караганда', 'Атырау'], correct: 1 },
      ],
      'Английский язык': [
        { text: 'Выберите правильную форму глагола: "He ___ to school every day"', options: ['go', 'goes', 'is going', 'went'], correct: 1 },
        { text: 'Какое слово означает "большой"?', options: ['small', 'big', 'tiny', 'little'], correct: 1 },
        { text: 'Present Simple третьего лица: "She ___"', options: ['eat', 'eats', 'eating', 'ate'], correct: 1 },
        { text: 'Множественное число "child"', options: ['childs', 'children', 'childes', 'childen'], correct: 1 },
        { text: '"Nice to meet you" означает', options: ['Пока', 'Привет', 'Приятно познакомиться', 'Спасибо'], correct: 2 },
      ],
    };

    // Создаем вопросы
    const questionsByCategory = {};
    for (const [category, questionsData] of Object.entries(allQuestions)) {
      questionsByCategory[category] = [];
      for (let i = 0; i < questionsData.length; i++) {
        const qData = questionsData[i];
        const question = new Question({
          text: qData.text,
          category: category,
          difficulty: i < 2 ? 'easy' : i < 4 ? 'medium' : 'hard',
          options: qData.options.map((text, idx) => ({
            text,
            isCorrect: idx === qData.correct,
          })),
          correctAnswerIndex: qData.correct,
          explanation: `Правильный ответ: ${qData.options[qData.correct]}`,
          createdBy: admin._id,
        });
        await question.save();
        questionsByCategory[category].push(question);
      }
    }
    console.log(`✅ ${Object.values(questionsByCategory).reduce((a, b) => a + b.length, 0)} вопросов созданы по 8 категориям`);

    // Создаем тесты для каждой категории
    const categories = [
      'Математика',
      'Русский язык',
      'Физика',
      'Химия',
      'Биология',
      'История',
      'География',
      'Английский язык',
    ];

    for (const category of categories) {
      const questions = questionsByCategory[category].slice(0, 5);
      const test = new Test({
        title: `ЕНТ - ${category}`,
        description: `Практический тест по предмету ${category} в формате ЕНТ`,
        category: category,
        timeLimit: 20,
        questionCount: questions.length,
        questions: questions.map(q => q._id),
        createdBy: admin._id,
        isActive: true,
      });
      await test.save();
    }
    console.log('✅ 8 тестов созданы (по одному на каждую категорию)');

    console.log('🎉 Инициализация БД завершена!');
  } catch (error) {
    console.error('❌ Ошибка инициализации БД:', error.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await initializeDatabase();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Сервер запущен на порту ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Не удалось запустить сервер:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
