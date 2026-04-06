const mongoose = require('mongoose');

let mongoServer = null;
let globalMongoUri = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.DATABASE_URL || process.env.MONGODB_URI;
    
    // Если нет переменных окружения, пытаемся использовать in-memory MongoDB
    if (!mongoUri || mongoUri === '') {
      // Используем глобальный экземпляр если уже создан
      if (globalMongoUri) {
        mongoUri = globalMongoUri;
        console.log('🧪 Используем существующий in-memory MongoDB');
      } else {
        console.log('🧪 MongoDB URI не установлена, пытаемся запустить in-memory MongoDB...');
        try {
          const { MongoMemoryServer } = require('mongodb-memory-server');
          mongoServer = await MongoMemoryServer.create();
          mongoUri = mongoServer.getUri();
          globalMongoUri = mongoUri;
          console.log('✅ In-memory MongoDB запущена на:', mongoUri);
        } catch (memErr) {
          console.log('⚠️ mongodb-memory-server недоступен. Инструкции:');
          console.log('');
          console.log('Вариант 1: Установите локальную MongoDB');
          console.log('  Windows: https://www.mongodb.com/try/download/community');
          console.log('  Затем используйте в .env: MONGODB_URI=mongodb://localhost:27017/testing-system');
          console.log('');
          console.log('Вариант 2: Используйте MongoDB Atlas (облако)');
          console.log('  1. Перейдите на https://www.mongodb.com/cloud/atlas');
          console.log('  2. Создайте бесплатный кластер');
          console.log('  3. Скопируйте строку подключения в .env');
          console.log('');
          throw memErr;
        }
      }
    }
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB подключена: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Ошибка подключения к БД: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.mongoServer = mongoServer;
