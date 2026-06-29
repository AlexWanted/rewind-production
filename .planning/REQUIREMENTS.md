# v1 Requirements

## Media Serving

- [ ] **MED-01**: Медиафайлы отдаются с FTP как основной источник, с fallback на локальный `public/uploads/`
  - `/api/uploads/[...path]` GET: читает файл с FTP через `ftp` пакет, при ошибке — из локального `public/uploads/`
  - `/api/files` GET: листинг директории с FTP, при ошибке — из локальной ФС
  - Типы контента: image/jpeg, image/png, image/gif, image/webp, video/mp4
  - Настройки FTP берутся из `.env` (уже есть: FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_BASE_PATH)

## v2 (Deferred)

(Нет deferred требований)

## Out of Scope

- Интерфейс управления файлами — уже есть в админке
- Миграция файлов — файлы уже загружаются на FTP через `/api/upload`
- Кэширование/оптимизация — задача только про переключение источника
- CDN/S3 — явно исключено, текущая инфраструктура FTP

## Traceability

| REQ-ID | Requirement | Phase | Status |
|--------|-------------|-------|--------|
| MED-01 | FTP-backed media serving with local fallback | Phase 1 | Pending |