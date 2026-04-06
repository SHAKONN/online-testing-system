const { Result, Test, Question, User } = require('../models');
const { calculateScore } = require('../utils/helpers');

// Сохранить результат теста
exports.submitTest = async (req, res) => {
  try {
    const { testId, answers, timeSpent } = req.body;
    const userId = req.user.id;

    const test = await Test.findById(testId).populate('questions');
    if (!test) {
      return res.status(404).json({ message: 'Тест не найден' });
    }

    // Проверяем ответы
    let correctAnswers = 0;
    const answersWithResults = answers.map((answer, idx) => {
      const question = test.questions.find(q => q._id.toString() === answer.questionId);
      if (!question) {
        return null;
      }

      const isCorrect = answer.selectedAnswerIndex === question.correctAnswerIndex;
      if (isCorrect) correctAnswers++;

      return {
        questionId: answer.questionId,
        selectedAnswerIndex: answer.selectedAnswerIndex,
        isCorrect,
        questionText: question.text,
      };
    }).filter(Boolean);

    const percentage = calculateScore(correctAnswers, test.questionCount);
    
    const result = new Result({
      user: userId,
      test: testId,
      category: test.category,
      answers: answersWithResults,
      score: correctAnswers,
      percentage,
      totalQuestions: test.questionCount,
      correctAnswers,
      timeSpent,
    });

    await result.save();

    // Обновляем статистику пользователя
    const user = await User.findById(userId);
    const allResults = await Result.find({ user: userId });
    const avgScore = allResults.reduce((sum, r) => sum + r.percentage, 0) / allResults.length;
    
    user.totalTests = allResults.length;
    user.averageScore = Math.round(avgScore * 100) / 100;
    await user.save();

    // Обновляем статистику теста
    test.totalAttempts += 1;
    test.averageScore = (allResults.filter(r => r.test.toString() === testId.toString()).reduce((sum, r) => sum + r.percentage, 0) / test.totalAttempts);
    await test.save();

    res.status(201).json({
      message: 'Результат сохранен',
      result: {
        _id: result._id,
        score: result.score,
        percentage: result.percentage,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        answers: answersWithResults,
      },
    });
  } catch (error) {
    console.error('Ошибка сохранения результата:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить результаты пользователя
exports.getUserResults = async (req, res) => {
  try {
    const userId = req.user.id;
    const results = await Result.find({ user: userId })
      .populate('test', 'title category timeLimit')
      .sort('-submittedAt');
    
    res.json(results);
  } catch (error) {
    console.error('Ошибка получения результатов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить результат по ID
exports.getResultById = async (req, res) => {
  try {
    const { resultId } = req.params;
    const result = await Result.findById(resultId)
      .populate('test')
      .populate('answers.questionId');
    
    if (!result) {
      return res.status(404).json({ message: 'Результат не найден' });
    }

    // Проверяем права доступа
    if (result.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    res.json(result);
  } catch (error) {
    console.error('Ошибка получения результата:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить лидерборд
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: 'user' })
      .sort('-averageScore')
      .limit(50)
      .select('-password');
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Ошибка получения лидерборда:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить статистику (для админа)
exports.getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalTests = await Test.countDocuments({ isActive: true });
    const totalResults = await Result.countDocuments();
    
    // Самые неудачные вопросы
    const failedQuestions = await Result.aggregate([
      { $unwind: '$answers' },
      { $match: { 'answers.isCorrect': false } },
      { $group: {
          _id: '$answers.questionId',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'questions',
          localField: '_id',
          foreignField: '_id',
          as: 'question'
        }
      }
    ]);

    const stats = {
      totalUsers,
      totalTests,
      totalResults,
      failedQuestions: failedQuestions.map(item => ({
        questionId: item._id,
        questionText: item.question[0]?.text,
        failCount: item.count,
      })),
    };

    res.json(stats);
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
