const { Question } = require('../models');

// Получить все вопросы
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('createdBy', 'name')
      .select('-explanation');
    
    res.json(questions);
  } catch (error) {
    console.error('Ошибка получения вопросов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить вопросы по категории
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const questions = await Question.find({ category })
      .populate('createdBy', 'name')
      .select('-explanation');
    
    res.json(questions);
  } catch (error) {
    console.error('Ошибка получения вопросов по категории:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Создать вопрос (admin)
exports.createQuestion = async (req, res) => {
  try {
    const {
      text,
      category,
      difficulty,
      options,
      correctAnswerIndex,
      explanation,
    } = req.body;

    const normalizedText = typeof text === 'string' ? text.trim() : '';
    const normalizedCategory = typeof category === 'string' ? category.trim() : '';
    const normalizedOptions = Array.isArray(options)
      ? options.map((opt) => (typeof opt === 'string' ? opt.trim() : ''))
      : [];
    const normalizedCorrectAnswerIndex = Number(correctAnswerIndex);

    if (!normalizedText || !normalizedCategory || normalizedOptions.length !== 4) {
      return res.status(400).json({
        message: 'Все поля обязательны. Должно быть ровно 4 варианта ответа',
      });
    }

    if (normalizedOptions.some((opt) => !opt)) {
      return res.status(400).json({
        message: 'Заполните все 4 варианта ответа',
      });
    }

    if (
      !Number.isInteger(normalizedCorrectAnswerIndex) ||
      normalizedCorrectAnswerIndex < 0 ||
      normalizedCorrectAnswerIndex >= normalizedOptions.length
    ) {
      return res.status(400).json({
        message: 'Выберите корректный правильный ответ',
      });
    }

    // Убедимся, что правильный ответ отмечен
    const optionsWithCorrect = normalizedOptions.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === normalizedCorrectAnswerIndex,
    }));

    const question = new Question({
      text: normalizedText,
      category: normalizedCategory,
      difficulty: difficulty || 'medium',
      options: optionsWithCorrect,
      correctAnswerIndex: normalizedCorrectAnswerIndex,
      explanation: typeof explanation === 'string' ? explanation.trim() : '',
      createdBy: req.user.id,
    });

    await question.save();
    res.status(201).json({ message: 'Вопрос создан', question });
  } catch (error) {
    console.error('Ошибка создания вопроса:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: Object.values(error.errors)[0]?.message || 'Некорректные данные вопроса',
      });
    }

    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Редактировать вопрос (admin)
exports.updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const {
      text,
      category,
      difficulty,
      options,
      correctAnswerIndex,
      explanation,
    } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Вопрос не найден' });
    }

    question.text = text || question.text;
    question.category = category || question.category;
    question.difficulty = difficulty || question.difficulty;
    question.explanation = explanation || question.explanation;

    if (options && options.length === 4) {
      question.options = options.map((opt, idx) => ({
        text: opt,
        isCorrect: idx === correctAnswerIndex,
      }));
      question.correctAnswerIndex = correctAnswerIndex;
    }

    await question.save();
    res.json({ message: 'Вопрос обновлен', question });
  } catch (error) {
    console.error('Ошибка обновления вопроса:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить вопрос (admin)
exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findByIdAndDelete(questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Вопрос не найден' });
    }

    res.json({ message: 'Вопрос удален' });
  } catch (error) {
    console.error('Ошибка удаления вопроса:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
