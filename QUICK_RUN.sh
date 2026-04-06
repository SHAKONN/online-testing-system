#!/bin/bash

# 🚀 БЫСТРЫЕ КОМАНДЫ ДЛЯ ЗАПУСКА ПРОЕКТА

# Цвета для вывода
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}Online Testing System${NC}"
echo -e "${YELLOW}Быстрый Запуск${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Переходим в нужную директорию
PROJECT_DIR="/Users/zhumazhanb/Desktop/diploma/online-testing-system"
cd "$PROJECT_DIR" || exit 1

echo -e "${YELLOW}1️⃣  Запуск MongoDB через Docker...${NC}"
echo "   Команда: docker-compose up -d"
echo ""
echo -e "${YELLOW}   ⏳ ВАЖНО: Docker Desktop должен быть открыт!${NC}"
echo "   Откройте: Applications → Docker"
echo ""
read -p "Нажмите ENTER когда Docker запустится..."

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен!${NC}"
    exit 1
fi

echo -e "${GREEN}   ⏳ Запускаю MongoDB...${NC}"
docker-compose up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ MongoDB запущена успешно!${NC}"
else
    echo -e "${RED}   ❌ Ошибка при запуске MongoDB${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "${YELLOW}2️⃣  ТЕРМИНАЛ 1 - Backend${NC}"
echo "   Команда:"
echo "   ${BLUE}cd /Users/zhumazhanb/Desktop/diploma/online-testing-system/backend${NC}"
echo "   ${BLUE}npm run dev${NC}"
echo ""
echo -e "${YELLOW}   ⏳ Дождитесь сообщения:${NC}"
echo "   ✅ MongoDB подключена: localhost"
echo "   ✅ Сервер запущен на порту 5000"
echo ""

echo -e "${YELLOW}3️⃣  ТЕРМИНАЛ 2 - Загрузка данных${NC}"
echo "   Команда (когда Backend запущен):"
echo "   ${BLUE}cd /Users/zhumazhanb/Desktop/diploma/online-testing-system/backend${NC}"
echo "   ${BLUE}npm run seed${NC}"
echo ""
echo -e "${YELLOW}   ⏳ Дождитесь сообщения:${NC}"
echo "   ✅ Данные успешно загружены в базу данных!"
echo ""

echo -e "${YELLOW}4️⃣  ТЕРМИНАЛ 3 - Frontend${NC}"
echo "   Команда:"
echo "   ${BLUE}cd /Users/zhumazhanb/Desktop/diploma/online-testing-system/frontend${NC}"
echo "   ${BLUE}npm start${NC}"
echo ""
echo -e "${YELLOW}   ⏳ Браузер откроется автоматически${NC}"
echo "   🌐 http://localhost:3000"
echo ""

echo -e "${BLUE}================================${NC}"
echo ""
echo -e "${GREEN}🔐 УЧЕТНЫЕ ДАННЫЕ:${NC}"
echo ""
echo -e "${YELLOW}Администратор:${NC}"
echo "   Email:    admin@example.com"
echo "   Password: admin123"
echo ""
echo -e "${YELLOW}Обычный пользователь:${NC}"
echo "   Email:    user1@example.com"
echo "   Password: password123"
echo ""

echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}✅ Все готово!${NC}"
echo -e "${YELLOW}Откройте 3 терминала и следуйте инструкциям выше.${NC}"
echo -e "${BLUE}================================${NC}"
