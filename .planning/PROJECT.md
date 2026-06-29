# Rewind Production

## What This Is

Сайт-портфолио продакшн-студии с админ-панелью. Публичная часть: видео- и фото-портфолио, услуги, контакты. Админка: управление контентом через Supabase, аутентификация через Firebase Google OAuth, загрузка медиафайлов на FTP-сервер.

## Core Value

Пользователь видит медиаконтент (видео, фото) — если медиа не грузятся, сайт бесполезен.

## Requirements

### Validated

- ✓ Публичный показ видео-портфолио — existing
- ✓ Публичный показ фото-портфолио — existing
- ✓ Админ-панель с Google OAuth — existing
- ✓ Управление видео/фото через Supabase — existing
- ✓ Загрузка файлов на FTP — existing

### Active

- [ ] MED-01: Медиафайлы на страницах отдаются с FTP (основной источник), с fallback на локальный public/uploads

### Out of Scope

- Интерфейс управления файлами на FTP — уже есть в админке
- Миграция существующих локальных файлов на FTP — файлы уже на FTP
- Замена инфраструктуры хранения (S3, CDN) — текущая задача только про переключение источника

## Context

**Текущее состояние:**
- Next.js 15 App Router, TypeScript, React 19
- Медиафайлы загружаются на FTP через `/api/upload`
- Отдача файлов — из локального `public/uploads/` через `/api/uploads/[...path]`
- Листинг файлов — из локальной ФС через `/api/files`
- Прямые ссылки `/uploads/...` в компонентах работают через Next.js static serving из `public/uploads/`
- FTP_PUBLIC_URL = `https://176.118.166.254/uploads/` (веб-доступ к FTP-директории)
- Настройки FTP в `.env`: FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_BASE_PATH, FTP_PUBLIC_URL

**Что нужно сделать:**
- `/api/uploads/[...path]` GET: читать с FTP, fallback на локальный `public/uploads/`
- `/api/files` GET: листинг с FTP, fallback на локальный
- Компоненты с прямыми ссылками `/uploads/...`: оставить как есть (Next.js static serving сам подхватит локальные fallback-файлы)

## Constraints

- **Совместимость**: Существующий API upload (POST) не трогаем — он уже работает с FTP
- **Безопасность**: Прокси через бэкенд, не отдаём прямые FTP-URL клиенту
- **Надёжность**: Локальный fallback при недоступности FTP

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| FTP как primary, локальный как fallback | Файлы уже загружаются на FTP; локальная копия — страховка | — Pending |

---
*Last updated: 2026-06-29 after initialization*