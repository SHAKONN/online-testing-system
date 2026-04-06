const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Математика',
      'Русский язык',
      'Физика',
      'Химия',
      'Биология',
      'История',
      'География',
      'Английский язык',
    ],
  },
  timeLimit: {
    type: Number, // в минутах
    default: 30,
  },
  questionCount: {
    type: Number,
    required: true,
    default: 10,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
  totalAttempts: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

testSchema.index({ category: 1 });
testSchema.index({ isActive: 1 });

module.exports = mongoose.model('Test', testSchema);
