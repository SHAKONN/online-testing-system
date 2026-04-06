const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Railway создаёт DATABASE_URL, используем её если доступна
    const mongoUri = process.env.DATABASE_URL || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI или DATABASE_URL не установлены!');
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
