# ExamManagerOS backup and restore

## Database backup

```bash
pg_dump "$DATABASE_URL" > /var/backups/exammanageros/db-$(date +%Y%m%d-%H%M%S).sql
```

Pre-deploy hook in `deploy-production.sh` runs backup when `DATABASE_URL` is set.

## Restore

```bash
psql "$DATABASE_URL" < /var/backups/exammanageros/db-YYYYMMDD-HHMMSS.sql
pm2 reload exammanageros-api
```

## Static rollback

```bash
sudo rsync -a --delete /var/www/exammanageros-previous/ /var/www/exammanageros/
sudo systemctl reload nginx
```
