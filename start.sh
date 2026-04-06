#!/bin/bash

# 🚀 БЫСТРЫЙ ЗАПУСК ONLINE TESTING SYSTEM

echo "🎓 Online Testing System - Автоматический запуск"
echo "================================================"
echo ""

# Проверяем Docker
echo "1️⃣  Проверяем Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker Desktop."
    exit 1
fi

# Запускаем MongoDB через Docker Compose
echo ""
echo "2️⃣  Запускаем MongoDB через Docker..."
if docker ps | grep -q mongodb; then
    echo "✅ MongoDB уже запущена"
else
    echo "⏳ Запуск MongoDB (ждите 5 сек)..."
    docker-compose up -d mongodb
    sleep 5
fi

# Проверяем MongoDB
if docker ps | grep -q mongodb; then
    echo "✅ MongoDB запущена успешно на порту 27017"
else
    echo "❌ MongoDB не запустилась"
    exit 1
fi

echo ""
echo "3️⃣  Установка завершена! Теперь..."
echo ""
echo "▶️  ТЕРМИНАЛ 1 - Backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "▶️  ТЕРМИНАЛ 2 - Загрузка данных (когда backend запустится):"
echo "   cd backend"
echo "   npm run seed"
echo ""
echo "▶️  ТЕРМИНАЛ 3 - Frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "================================================"
echo "🔐 Тестовые аккаунты:"
echo "   Admin:  admin@example.com / admin123"
echo "   User:   user1@example.com / password123"
echo "================================================"
