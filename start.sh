#!/bin/bash
# ═══════════════════════════════════════════════════
# AK Agency — Script de démarrage complet
# Lance MySQL, l'API et le front en une seule commande
# Usage : bash start.sh
# ═══════════════════════════════════════════════════

set -e

BREW=/opt/homebrew/bin/brew
MYSQL_BIN=/opt/homebrew/opt/mysql/bin/mysql
API_DIR="$(cd "$(dirname "$0")/api" && pwd)"
FRONT_DIR="$(cd "$(dirname "$0")/ak" && pwd)"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║       AK Agency — Démarrage          ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── 1. MySQL ──────────────────────────────────────
echo "▶ Démarrage MySQL..."
$BREW services start mysql 2>/dev/null || true
sleep 2

# Vérifie que MySQL répond
if ! $MYSQL_BIN -u root -e "SELECT 1;" &>/dev/null; then
  echo "❌ MySQL ne répond pas. Vérifiez votre installation."
  exit 1
fi
echo "✅ MySQL actif"

# ── 2. Crée la BDD si besoin ──────────────────────
$MYSQL_BIN -u root -e "CREATE DATABASE IF NOT EXISTS ak_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

TABLES=$($MYSQL_BIN -u root -e "SHOW TABLES FROM ak_agency;" 2>/dev/null | wc -l | tr -d ' ')
if [ "$TABLES" -lt "2" ]; then
  echo "▶ Import du schéma SQL..."
  $MYSQL_BIN -u root < "$API_DIR/database/schema.sql"
  echo "✅ Schéma importé"
fi

# ── 3. Seed si la table users est vide ───────────
USERS=$($MYSQL_BIN -u root -e "SELECT COUNT(*) FROM ak_agency.users;" 2>/dev/null | tail -1 | tr -d ' ')
if [ "$USERS" = "0" ]; then
  echo "▶ Création du compte admin..."
  cd "$API_DIR" && node scripts/seed.js
fi

# ── 4. Tue les éventuels processus sur les ports ─
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 1

# ── 5. Lance l'API en arrière-plan ────────────────
echo ""
echo "▶ Lancement de l'API (port 4000)..."
cd "$API_DIR" && node app.js &
API_PID=$!
sleep 2

if ! kill -0 $API_PID 2>/dev/null; then
  echo "❌ L'API n'a pas démarré."
  exit 1
fi
echo "✅ API démarrée (PID $API_PID)"

# ── 6. Lance le front ─────────────────────────────
echo "▶ Lancement du front React (port 5173)..."
cd "$FRONT_DIR" && npm run dev &
FRONT_PID=$!
sleep 3

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  ✅ Tout est lancé !                              ║"
echo "║                                                   ║"
echo "║  🌐 Site public  →  http://localhost:5173         ║"
echo "║  🔐 Panel admin  →  http://localhost:5173/admin/login"
echo "║  🔧 API REST     →  http://localhost:4000/api     ║"
echo "║                                                   ║"
echo "║  Identifiants admin :                             ║"
echo "║    Email    : lucasaksu@gmail.com                 ║"
echo "║    Password : Admin@2026!                         ║"
echo "║                                                   ║"
echo "║  Ctrl+C pour tout arrêter                         ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# ── Attente + arrêt propre ────────────────────────
trap "echo ''; echo 'Arrêt...'; kill $API_PID $FRONT_PID 2>/dev/null; $BREW services stop mysql 2>/dev/null; exit 0" INT TERM

wait
