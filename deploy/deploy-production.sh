#!/usr/bin/env bash
# Production deploy: static SPA + API (PM2) + nginx + database schema.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_ROOT="${EXAMMANAGEROS_WEB_ROOT:-/var/www/exammanageros}"
ENV_FILE="${EXAMMANAGEROS_ENV_FILE:-/home/ubuntu/projects/scripts/exammanageros.env}"
EXAMMANAGEROS_DOMAIN="${EXAMMANAGEROS_DOMAIN:-exams.cagteam.net}"
PUBLIC_URL="https://${EXAMMANAGEROS_DOMAIN}/"
API_HEALTH="http://127.0.0.1:5031/api/healthz"
NGINX_SITE="/etc/nginx/sites-available/${EXAMMANAGEROS_DOMAIN}"
NGINX_SNIPPET="$REPO_ROOT/deploy/nginx-exammanageros.conf"
BACKUP_DIR="/var/backups/exammanageros/db"

wait_for_http() {
  local url="$1"
  local label="$2"
  local max_attempts="${3:-30}"
  local attempt=1
  local code=""
  while [ "$attempt" -le "$max_attempts" ]; do
    code="$(curl -s -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || true)"
    if [ "${code}" = "200" ]; then
      echo "==> ${label}: OK"
      return 0
    fi
    sleep 1
    attempt=$((attempt + 1))
  done
  echo "ERROR: ${label} — expected HTTP 200 from ${url}, got ${code:-connection failed}"
  return 1
}

echo "==> Repo: $REPO_ROOT"
cd "$REPO_ROOT"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: Missing $ENV_FILE"
  exit 1
fi

echo "==> Installing dependencies"
pnpm install --frozen-lockfile 2>/dev/null || pnpm install

echo "==> Typecheck + API tests"
pnpm run typecheck
pnpm --filter @workspace/api-server run test

echo "==> Building API server"
pnpm --filter @workspace/api-server run build

echo "==> Building frontend (BASE_PATH=/, PORT=5030)"
BASE_PATH=/ PORT=5030 pnpm --filter @workspace/exammanageros run build

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -n "${DATABASE_URL:-}" ]]; then
  sudo mkdir -p "$BACKUP_DIR"
  if pg_dump "$DATABASE_URL" > "${BACKUP_DIR}/pre-deploy-$(date +%Y%m%d-%H%M%S).sql" 2>/dev/null; then
    echo "==> Database backup saved"
  fi
  echo "==> Pushing database schema"
  pnpm --filter @workspace/db run push
fi

if command -v pm2 >/dev/null 2>&1; then
  echo "==> PM2 start/reload API"
  if pm2 describe exammanageros-api >/dev/null 2>&1; then
    pm2 reload exammanageros-api --update-env
  else
    pm2 start "$REPO_ROOT/deploy/ecosystem.exammanageros-api.config.cjs"
  fi
  pm2 save
  wait_for_http "$API_HEALTH" "API health" 45 || exit 1
fi

echo "==> Deploying static files to $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete "$REPO_ROOT/artifacts/exammanageros/dist/public/" "$WEB_ROOT/"
sudo chown -R www-data:www-data "$WEB_ROOT"

if [[ "${EXAMMANAGEROS_ENABLE_NGINX:-1}" == "1" ]]; then
  echo "==> Updating nginx for ${EXAMMANAGEROS_DOMAIN}"
  sudo cp "$NGINX_SNIPPET" "$NGINX_SITE"
  sudo ln -sf "$NGINX_SITE" "/etc/nginx/sites-enabled/${EXAMMANAGEROS_DOMAIN}"
  sudo nginx -t
  sudo systemctl reload nginx
  wait_for_http "${PUBLIC_URL}api/healthz" "Public API health" 30 || true
  wait_for_http "$PUBLIC_URL" "Public SPA" 30 || true
fi

echo "==> Deploy complete"
echo "    Public:  ${PUBLIC_URL}"
echo "    API:     ${PUBLIC_URL}api/healthz"
