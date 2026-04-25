# ERPNext Docker — Лаборатория Ремонта

## Быстрый запуск

### 1. Установить Docker
https://docs.docker.com/get-docker/

### 2. Запустить контейнеры
```bash
cd docker
docker compose up -d
```
Дождаться пока все контейнеры поднимутся (~1-2 минуты).

### 3. Восстановить базу данных
```bash
# Скопировать дамп внутрь контейнера БД
docker cp db-backup.sql $(docker compose ps -q db):/tmp/db-backup.sql

# Восстановить
docker compose exec db mariadb -u root -padmin < /tmp/db-backup.sql
```

### 4. Скопировать конфиг сайта
```bash
# Создать директорию сайта
docker compose exec backend bench new-site frontend \
  --mariadb-root-password admin \
  --admin-password admin \
  --no-mariadb-socket || true

# Скопировать конфиг
docker cp site_config.json $(docker compose ps -q backend):/home/frappe/frappe-bench/sites/frontend/site_config.json

# Перезапустить
docker compose restart backend
```

### 5. Проверить
Открыть http://localhost:8080 — должен работать ERPNext.

## API-ключ
- API Key: `ffdaeed6662f499`
- API Secret: `70595909d34a5bb`
- Авторизация: `Authorization: token ffdaeed6662f499:70595909d34a5bb`

## Cloudflare Tunnel (для Vercel)
Чтобы Vercel-фронтенд мог обращаться к локальному ERPNext:

```bash
# Установить cloudflared
brew install cloudflared

# Запустить туннель
cloudflared tunnel --url http://localhost:8080
```

Скопировать выданный URL (https://xxx.trycloudflare.com) и установить как `ERP_URL` в Vercel:
```bash
vercel env rm ERP_URL production -y
echo "https://xxx.trycloudflare.com" | vercel env add ERP_URL production
vercel --prod --yes
```

**Важно:** туннель умирает при перезагрузке — нужно перезапускать и обновлять URL.

## Структура проекта
- `docker-compose.yml` — конфигурация контейнеров
- `db-backup.sql` — дамп базы данных со всеми товарами
- `site_config.json` — конфиг сайта ERPNext
- Фронтенд: https://github.com/skalpel163-stack/lab-warehouse

## Vercel
Фронтенд задеплоен на https://lab-warehouse.vercel.app
Для деплоя: `vercel --prod --yes`
