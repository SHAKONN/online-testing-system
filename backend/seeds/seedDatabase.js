require('dotenv').config();
const mongoose = require('mongoose');
const { User, Question, Test } = require('../src/models');
const connectDB = require('../config/database');

const CATEGORIES = [
  'Математика',
  'Русский язык',
  'Физика',
  'Химия',
  'Биология',
  'История',
  'География',
  'Английский язык',
];

const seedQuestions = async () => {
  try {
    await connectDB();

    // Очищаем базу
    await User.deleteMany({});
    await Question.deleteMany({});
    await Test.deleteMany({});

    // Создаем admin пользователя
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
    await adminUser.save();
    console.log('✅ Admin пользователь создан');

    // Создаем обычных пользователей
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
    console.log('✅ 5 обычных пользователей созданы');

    // Создаем вопросы для каждой категории
    const questions = [];
    
    for (const category of CATEGORIES) {
      // Вопрос для Математики
      if (category === 'Математика') {
        const q1 = new Question({
          text: 'Чему равно 2 + 2?',
          category: 'Математика',
          difficulty: 'easy',
          options: [
            { text: '3', isCorrect: false },
            { text: '4', isCorrect: true },
            { text: '5', isCorrect: false },
            { text: '6', isCorrect: false },
          ],
          correctAnswerIndex: 1,
          explanation: '2 + 2 = 4',
          createdBy: adminUser._id,
        });
        await q1.save();
        questions.push(q1);

        const q2 = new Question({
          text: 'Какой логарифм основного 10 от 100?',
          category: 'Математика',
          difficulty: 'medium',
          options: [
            { text: '1', isCorrect: false },
            { text: '2', isCorrect: true },
            { text: '3', isCorrect: false },
            { text: '4', isCorrect: false },
          ],
          correctAnswerIndex: 1,
          explanation: 'log₁₀(100) = 2, так как 10² = 100',
          createdBy: adminUser._id,
        });
        await q2.save();
        questions.push(q2);

        const q3 = new Question({
          text: 'Чему равна производная x³?',
          category: 'Математика',
          difficulty: 'hard',
          options: [
            { text: '3x²', isCorrect: true },
            { text: 'x²', isCorrect: false },
            { text: '3x', isCorrect: false },
            { text: 'x', isCorrect: false },
          ],
          correctAnswerIndex: 0,
          explanation: 'Производная от x³ равна 3x² по правилу степени',
          createdBy: adminUser._id,
        });
        await q3.save();
        questions.push(q3);
      }

      // Вопросы для Русского языка
      if (category === 'Русский язык') {
        const q1 = new Question({
          text: 'Как пишется слово "жюри"?',
          category: 'Русский язык',
          difficulty: 'easy',
          options: [
            { text: 'жюри', isCorrect: true },
            { text: 'жури', isCorrect: false },
            { text: 'жюрий', isCorrect: false },
            { text: 'жуири', isCorrect: false },
          ],
          correctAnswerIndex: 0,
          explanation: '"Жюри" - французское слово, заимствованное в русский язык',
          createdBy: adminUser._id,
        });
        await q1.save();
        questions.push(q1);

        const q2 = new Question({
          text: 'Какого рода слово "кофе"?',
          category: 'Русский язык',
          difficulty: 'medium',
          options: [
            { text: 'Женский род', isCorrect: false },
            { text: 'Средний род', isCorrect: false },
            { text: 'Мужской род', isCorrect: true },
            { text: 'Все варианты правильны', isCorrect: false },
          ],
          correctAnswerIndex: 2,
          explanation: 'В современном русском языке слово "кофе" мужского рода',
          createdBy: adminUser._id,
        });
        await q2.save();
        questions.push(q2);

        const q3 = new Question({
          text: 'Какое слово является однокоренным слову "вода"?',
          category: 'Русский язык',
          difficulty: 'hard',
          options: [
            { text: 'водяной', isCorrect: true },
            { text: 'водить', isCorrect: false },
            { text: 'воздух', isCorrect: false },
            { text: 'вот', isCorrect: false },
          ],
          correctAnswerIndex: 0,
          explanation: '"Водяной" - однокоренное слово, имеет общий корень "вод"',
          createdBy: adminUser._id,
        });
        await q3.save();
        questions.push(q3);
      }

      // Вопросы для Физики
      if (category === 'Физика') {
        const q1 = new Question({
          text: 'Как называется сила, которая противодействует движению?',
          category: 'Физика',
          difficulty: 'easy',
          options: [
            { text: 'Трение', isCorrect: true },
            { text: 'Инерция', isCorrect: false },
            { text: 'Энергия', isCorrect: false },
            { text: 'Импульс', isCorrect: false },
          ],
          correctAnswerIndex: 0,
          explanation: 'Трение - это сила, которая противодействует относительному движению',
          createdBy: adminUser._id,
        });
        await q1.save();
        questions.push(q1);

        const q2 = new Question({
          text: 'Какая формула выражает второй закон Ньютона?',
          category: 'Физика',
          difficulty: 'medium',
          options: [
            { text: 'F = ma', isCorrect: true },
            { text: 'E = mc²', isCorrect: false },
            { text: 'v = at', isCorrect: false },
            { text: 'p = mv', isCorrect: false },
          ],
          correctAnswerIndex: 0,
          explanation: 'Второй закон Ньютона: F = ma (сила = масса × ускорение)',
          createdBy: adminUser._id,
        });
        await q2.save();
        questions.push(q2);

        const q3 = new Question({
          text: 'Чему равна скорость света в вакууме?',
          category: 'Физика',
          difficulty: 'hard',
          options: [
            { text: '3 × 10⁸ м/с', isCorrect: true },
            { text: '3 × 10⁶ м/с', isCorrect: false },
            { text: '3 × 10¹⁰ м/с', isCorrect: false },
            { text: '3 × 10⁴ м/с', isCorrect: false },
          ],
          correctAnswerIndex: 0,
          explanation: 'Скорость света c = 3 × 10⁸ м/с ≈ 300 000 км/с',
          createdBy: adminUser._id,
        });
        await q3.save();
        questions.push(q3);
      }

      // Добавьте вопросы для других категорий аналогично...
      // Для краткости добавлю по одному вопросу для оставшихся категорий

      if (['Химия', 'Биология', 'История', 'География', 'Английский язык'].includes(category)) {
        const q = new Question({
          text: `Пример вопроса для категории "${category}"`,
          category,
          difficulty: 'easy',
          options: [
            { text: 'Вариант 1', isCorrect: true },
            { text: 'Вариант 2', isCorrect: false },
            { text: 'Вариант 3', isCorrect: false },
            { text: 'Вариант 4', isCorrect: false },
          ],
          correctAnswerIndex: 0,
          explanation: `Объяснение для вопроса из категории "${category}"`,
          createdBy: adminUser._id,
        });
        await q.save();
        questions.push(q);
      }
    }

    console.log(`✅ ${questions.length} вопросов создано`);

    // Создаем тесты
    const tests = [];
    
    for (const category of CATEGORIES) {
      const categoryQuestions = questions.filter(q => q.category === category);
      
      if (categoryQuestions.length >= 3) {
        const test = new Test({
          title: `Тест по ${category}`,
          description: `Проверьте свои знания в области ${category}`,
          category,
          timeLimit: 30,
          questionCount: Math.min(categoryQuestions.length, 5),
          questions: categoryQuestions.slice(0, 5),
          createdBy: adminUser._id,
          isActive: true,
        });
        await test.save();
        tests.push(test);
      }
    }

    console.log(`✅ ${tests.length} тестов создано`);

    console.log('\n📊 Данные успешно загружены в базу данных!');
    console.log('\n📧 Тестовые аккаунты:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User1: user1@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при загрузке данных:', error);
    process.exit(1);
  }
};

seedQuestions();
