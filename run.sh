#!/bin/bash

# 🚀 ЗАПУСК ВСЕЙ СИСТЕМЫ ОДНОЙ КОМАНДОЙ

set -e  # Выход на ошибке

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'  # No Color

echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 ONLINE TESTING SYSTEM - ПОЛНЫЙ ЗАПУСК${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo ""

# Шаг 1: Проверка Docker
echo -e "${YELLOW}1️⃣  Проверка Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен!${NC}"
    exit 1
fi

# Шаг 2: Проверка Docker Desktop
if ! docker ps &> /dev/null; then
    echo -e "${RED}❌ Docker daemon не работает!${NC}"
    echo -e "${YELLOW}   Откройте Docker Desktop и попробуйте снова${NC}"
    exit 1
fi
echo -e "${GREEN}   ✅ Docker работает${NC}"

# Шаг 3: Запуск MongoDB
echo ""
echo -e "${YELLOW}2️⃣  Запуск MongoDB...${NC}"
if docker ps | grep -q online-testing-mongodb; then
    echo -e "${GREEN}   ✅ MongoDB уже работает${NC}"
else
    cd "$PROJECT_DIR"
    docker-compose up -d > /dev/null 2>&1
    echo -e "${GREEN}   ✅ MongoDB запущена${NC}"
    sleep 2
fi

# Шаг 4: Загрузка тестовых данных
echo ""
echo -e "${YELLOW}3️⃣  Загрузка тестовых данных...${NC}"
cd "$PROJECT_DIR/backend"
npm run seed > /dev/null 2>&1
echo -e "${GREEN}   ✅ Тестовые данные загружены${NC}"

# Шаг 5: Запуск Backend, Seed и Frontend в разных вкладках Terminal
echo ""
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ СИСТЕМА ГОТОВА!${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Откройте 2 новых терминала и выполните:${NC}"
echo ""
echo -e "${BLUE}ТЕРМИНАЛ 1 - Backend:${NC}"
echo -e "  ${GREEN}cd $PROJECT_DIR/backend && npm run dev${NC}"
echo ""
echo -e "${BLUE}ТЕРМИНАЛ 2 - Frontend:${NC}"
echo -e "  ${GREEN}cd $PROJECT_DIR/frontend && npm start${NC}"
echo ""
echo -e "${GREEN}🌐 Frontend будет доступен на: http://localhost:3000${NC}"
echo -e "${GREEN}🔌 Backend работает на: http://localhost:5001${NC}"
echo ""
echo -e "${YELLOW}🔐 Тестовые аккаунты:${NC}"
echo -e "  ${GREEN}Admin: admin@example.com / admin123${NC}"
echo -e "  ${GREEN}User:  user1@example.com / password123${NC}"
echo ""
