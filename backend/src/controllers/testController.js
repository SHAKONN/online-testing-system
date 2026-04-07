const { Test, Question } = require('../models');
const { shuffleArray } = require('../utils/helpers');

// Получить все активные тесты
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({ isActive: true })
      .populate('createdBy', 'name')
      .select('-questions');
    
    res.json(tests);
  } catch (error) {
    console.error('Ошибка получения тестов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить тест по категории
exports.getTestsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const tests = await Test.find({ category, isActive: true })
      .populate('createdBy', 'name')
      .select('-questions');
    
    res.json(tests);
  } catch (error) {
    console.error('Ошибка получения тестов по категории:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить тест с вопросами (для прохождения)
exports.getTestWithQuestions = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId).populate('questions');
    
    if (!test) {
      return res.status(404).json({ message: 'Тест не найден' });
    }

    let testQuestions = Array.isArray(test.questions) ? test.questions : [];

    // Поддержка старых тестов, которые были созданы без привязанных вопросов
    if (testQuestions.length === 0) {
      testQuestions = await Question.find({ category: test.category });
    }

    if (testQuestions.length === 0) {
      return res.status(400).json({
        message: 'В этом тесте пока нет вопросов',
      });
    }

    // Перемешиваем вопросы
    const shuffledQuestions = shuffleArray(testQuestions);

    // Отправляем вопросы без правильных ответов (для безопасности)
    const questionsForResponse = shuffledQuestions.map(q => ({
      _id: q._id,
      text: q.text,
      category: q.category,
      difficulty: q.difficulty,
      options: q.options.map(opt => ({ text: opt.text })), // Без isCorrect
    }));

    res.json({
      _id: test._id,
      title: test.title,
      description: test.description,
      category: test.category,
      timeLimit: test.timeLimit,
      totalQuestions: questionsForResponse.length,
      questions: questionsForResponse,
    });
  } catch (error) {
    console.error('Ошибка получения теста с вопросами:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Создать тест (admin)
exports.createTest = async (req, res) => {
  try {
    const { title, description, category, timeLimit, questionIds, questions } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Заполните обязательные поля' });
    }

    let resolvedQuestionIds = Array.isArray(questionIds)
      ? [...new Set(questionIds.filter(Boolean))]
      : [];

    if (resolvedQuestionIds.length === 0 && Array.isArray(questions) && questions.length > 0) {
      const preparedQuestions = questions.map((question, index) => {
        const normalizedText = typeof question.text === 'string' ? question.text.trim() : '';
        const normalizedOptions = Array.isArray(question.options)
          ? question.options.map((option) => (typeof option === 'string' ? option.trim() : ''))
          : [];
        const normalizedCorrectAnswerIndex = Number(question.correctAnswerIndex);

        if (!normalizedText) {
          throw new Error(`В вопросе ${index + 1} отсутствует текст`);
        }

        if (normalizedOptions.length !== 4 || normalizedOptions.some((option) => !option)) {
          throw new Error(`В вопросе ${index + 1} должно быть ровно 4 заполненных варианта ответа`);
        }

        if (
          !Number.isInteger(normalizedCorrectAnswerIndex) ||
          normalizedCorrectAnswerIndex < 0 ||
          normalizedCorrectAnswerIndex >= normalizedOptions.length
        ) {
          throw new Error(`В вопросе ${index + 1} выбран некорректный правильный ответ`);
        }

        return {
          text: normalizedText,
          category,
          difficulty: question.difficulty || 'medium',
          options: normalizedOptions.map((option, optionIndex) => ({
            text: option,
            isCorrect: optionIndex === normalizedCorrectAnswerIndex,
          })),
          correctAnswerIndex: normalizedCorrectAnswerIndex,
          explanation: typeof question.explanation === 'string' ? question.explanation.trim() : '',
          createdBy: req.user.id,
        };
      });

      const createdQuestions = await Question.insertMany(preparedQuestions);
      resolvedQuestionIds = createdQuestions.map((question) => question._id);
    }

    if (resolvedQuestionIds.length === 0) {
      return res.status(400).json({
        message: 'Добавьте хотя бы один вопрос для теста.',
      });
    }

    const existingQuestions = await Question.find({
      _id: { $in: resolvedQuestionIds },
      category,
    }).select('_id');

    if (existingQuestions.length !== resolvedQuestionIds.length) {
      return res.status(400).json({
        message: 'Некоторые выбранные вопросы не найдены или не относятся к выбранной категории.',
      });
    }

    const test = new Test({
      title,
      description,
      category,
      timeLimit: timeLimit || 30,
      questionCount: resolvedQuestionIds.length,
      questions: resolvedQuestionIds,
      createdBy: req.user.id,
    });

    await test.save();
    res.status(201).json({ message: 'Тест создан', test });
  } catch (error) {
    console.error('Ошибка создания теста:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Редактировать тест (admin)
exports.updateTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { title, description, category, timeLimit, questionIds } = req.body;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Тест не найден' });
    }

    test.title = title || test.title;
    test.description = description || test.description;
    test.category = category || test.category;
    test.timeLimit = timeLimit || test.timeLimit;
    
    if (questionIds) {
      test.questions = questionIds;
      test.questionCount = questionIds.length;
    }

    await test.save();
    res.json({ message: 'Тест обновлен', test });
  } catch (error) {
    console.error('Ошибка обновления теста:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить тест (admin)
exports.deleteTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findByIdAndDelete(testId);
    
    if (!test) {
      return res.status(404).json({ message: 'Тест не найден' });
    }

    res.json({ message: 'Тест удален' });
  } catch (error) {
    console.error('Ошибка удаления теста:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
