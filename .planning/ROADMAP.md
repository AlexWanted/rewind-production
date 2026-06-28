# Roadmap: Rewind Production

## Overview

Переключение отдачи медиафайлов с локальной файловой системы на FTP как основной источник, с прозрачным локальным fallback при недоступности FTP. Существующий маршрут загрузки на FTP не трогаем.

## Phases

- [ ] **Phase 1: FTP-Backed Media Serving** - `/api/uploads/[...path]` и `/api/files` читают с FTP, fallback на локальный `public/uploads/`

## Phase Details

### Phase 1: FTP-Backed Media Serving
**Goal**: Медиафайлы отдаются с FTP как основной источник, с прозрачным локальным fallback при недоступности FTP
**Depends on**: Nothing (first phase)
**Requirements**: MED-01
**Success Criteria** (what must be TRUE):
  1. Пользователь открывает страницу портфолио — изображения и видео загружаются с FTP
  2. При недоступности FTP медиафайлы продолжают загружаться из локального `public/uploads/` — пользователь не видит битых ссылок
  3. Админ-панель показывает список файлов — данные приходят с FTP (с fallback на локальную ФС)
  4. Загрузка файлов через `/api/upload` работает как и прежде — регрессий нет
**Plans**: 4 plans
**UI hint**: no

**Plan list**:
- [ ] 01-01-PLAN.md — Create shared FTP utility (lib/ftp.ts)
- [ ] 01-02-PLAN.md — Update /api/uploads/[...path] for FTP serving with fallback
- [ ] 01-03-PLAN.md — Update /api/files for FTP listing with fallback
- [ ] 01-04-PLAN.md — Verify all success criteria and no regressions

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. FTP-Backed Media Serving | 0/TBD | Not started | - |