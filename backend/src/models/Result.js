const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
      selectedAnswerIndex: Number,
      isCorrect: Boolean,
      questionText: String,
    },
  ],
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  percentage: {
    type: Number,
    required: true,
    default: 0,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
    default: 0,
  },
  timeSpent: {
    type: Number, // в секундах
    default: 0,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

resultSchema.index({ user: 1, test: 1 });
resultSchema.index({ user: 1 });
resultSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Result', resultSchema);
