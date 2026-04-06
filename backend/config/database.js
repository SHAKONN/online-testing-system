const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const mongoUri = isProduction
      ? process.env.DATABASE_URL
      : process.env.MONGODB_URI || process.env.DATABASE_URL;

    // В production режиме требуется DATABASE_URL
    if (isProduction) {
      if (!mongoUri) {
        throw new Error('DATABASE_URL не установлена в production режиме! Используйте MongoDB Atlas.');
      }
    } else {
      // В development можно использовать in-memory если нет URI
      if (!mongoUri || mongoUri === '') {
        console.log('🧪 MongoDB URI не установлена, пытаемся запустить in-memory MongoDB...');
        try {
          const { MongoMemoryServer } = require('mongodb-memory-server');
          const mongoServer = await MongoMemoryServer.create();
          mongoUri = mongoServer.getUri();
          console.log('✅ In-memory MongoDB запущена на:', mongoUri);
        } catch (memErr) {
          console.log('⚠️ mongodb-memory-server недоступен. Используйте MongoDB Atlas или локальную MongoDB.');
          throw memErr;
        }
      }
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB подключена: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Ошибка подключения к БД: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
