const extractJsonArray = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Пустой ответ от модели');
  }

  const startIndex = text.indexOf('[');
  const endIndex = text.lastIndexOf(']');

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error('Не удалось распознать JSON массив в ответе модели');
  }

  return text.slice(startIndex, endIndex + 1);
};

const normalizeGeneratedQuestion = (question, category, index) => {
  const text = typeof question?.text === 'string' ? question.text.trim() : '';
  const explanation = typeof question?.explanation === 'string' ? question.explanation.trim() : '';
  const difficulty = ['easy', 'medium', 'hard'].includes(question?.difficulty)
    ? question.difficulty
    : 'medium';
  const options = Array.isArray(question?.options)
    ? question.options.map((option) => (typeof option === 'string' ? option.trim() : ''))
    : [];
  const correctAnswerIndex = Number(question?.correctAnswerIndex);

  if (!text) {
    throw new Error(`ИИ вернул пустой текст для вопроса ${index + 1}`);
  }

  if (options.length !== 4 || options.some((option) => !option)) {
    throw new Error(`ИИ вернул некорректные варианты ответа для вопроса ${index + 1}`);
  }

  if (!Number.isInteger(correctAnswerIndex) || correctAnswerIndex < 0 || correctAnswerIndex > 3) {
    throw new Error(`ИИ вернул некорректный correctAnswerIndex для вопроса ${index + 1}`);
  }

  return {
    text,
    category,
    difficulty,
    options,
    correctAnswerIndex,
    explanation,
  };
};

const buildPrompt = ({ category, count }) => `
Сгенерируй ${count} качественных тестовых вопросов для предмета "${category}" на русском языке.

Требования:
- Верни только JSON-массив без markdown и без пояснений.
- Каждый элемент массива должен иметь поля:
  "text": string
  "difficulty": "easy" | "medium" | "hard"
  "options": [string, string, string, string]
  "correctAnswerIndex": number
  "explanation": string
- В каждом вопросе должно быть ровно 4 варианта ответа.
- correctAnswerIndex должен быть от 0 до 3.
- Вопросы должны быть разными, без повторов.
- Формулировки должны быть естественными и понятными для школьного/студенческого теста.
- Не используй варианты вроде "все ответы верны" или "ничего из перечисленного".
- Распредели сложность примерно равномерно.
`;

const generateQuestionsWithOpenAI = async ({ category, count }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-5.2';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY не настроен на сервере');
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: buildPrompt({ category, count }),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.output_text;
  const parsed = JSON.parse(extractJsonArray(rawText));

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('ИИ не вернул список вопросов');
  }

  return parsed.slice(0, count).map((question, index) =>
    normalizeGeneratedQuestion(question, category, index)
  );
};

module.exports = {
  generateQuestionsWithOpenAI,
};
