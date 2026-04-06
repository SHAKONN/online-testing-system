#!/bin/bash

# 🚀 ПОЛНЫЙ ЗАПУСК В РАЗНЫХ ОКНАХ TERMINAL (MAC ONLY)

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 ПОЛНЫЙ ЗАПУСК СИСТЕМЫ${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Проверяем Docker
if ! docker ps &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker не работает! Откройте Docker Desktop${NC}"
    open -a Docker
    sleep 10
fi

# Шаг 1: MongoDB
echo -e "${YELLOW}1️⃣  Запуск MongoDB...${NC}"
cd "$PROJECT_DIR"
if ! docker ps | grep -q online-testing-mongodb; then
    docker-compose up -d
    sleep 3
fi
echo -e "${GREEN}   ✅ MongoDB готова${NC}"
echo ""

# Шаг 2: Загрузка данных
echo -e "${YELLOW}2️⃣  Загрузка тестовых данных...${NC}"
cd "$PROJECT_DIR/backend"
npm run seed > /dev/null 2>&1
echo -e "${GREEN}   ✅ Данные загружены${NC}"
echo ""

# Шаг 3: Backend в новом окне Terminal
echo -e "${YELLOW}3️⃣  Запуск Backend в новом окне...${NC}"
osascript <<EOF
tell application "Terminal"
    do script "cd '$PROJECT_DIR/backend' && npm run dev"
end tell
EOF
sleep 2
echo -e "${GREEN}   ✅ Backend окно открыто${NC}"
echo ""

# Шаг 4: Frontend в новом окне Terminal
echo -e "${YELLOW}4️⃣  Запуск Frontend в новом окне...${NC}"
osascript <<EOF
tell application "Terminal"
    do script "cd '$PROJECT_DIR/frontend' && npm start"
end tell
EOF
sleep 2
echo -e "${GREEN}   ✅ Frontend окно открыто${NC}"
echo ""

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ ВСЯ СИСТЕМА ЗАПУЩЕНА!${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🌐 Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}🔌 Backend: http://localhost:5001${NC}"
echo ""
echo -e "${YELLOW}🔐 Учетные данные:${NC}"
echo -e "   ${GREEN}Admin: admin@example.com / admin123${NC}"
echo -e "   ${GREEN}User:  user1@example.com / password123${NC}"
echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
