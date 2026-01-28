#!/bin/bash
# ===========================================
# Teatro Real - Script de Deploy
# ===========================================
# Sincroniza los cambios con GitLab y GitHub,
# y despliega automáticamente en Render y Vercel.
#
# Uso:
#   ./deploy.sh                    # Deploy de todo (backend + frontend)
#   ./deploy.sh backend            # Solo backend
#   ./deploy.sh frontend           # Solo frontend
#   ./deploy.sh --no-push-origin   # Solo GitHub (sin GitLab)
# ===========================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
ORIGIN_BRANCH="development"
GITHUB_BRANCH="main"
PUSH_ORIGIN=true

# Parsear argumentos
DEPLOY_BACKEND=true
DEPLOY_FRONTEND=true

for arg in "$@"; do
    case $arg in
        backend)
            DEPLOY_FRONTEND=false
            ;;
        frontend)
            DEPLOY_BACKEND=false
            ;;
        --no-push-origin)
            PUSH_ORIGIN=false
            ;;
    esac
done

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}   Teatro Real - Deploy Script${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d "teatro-real-backend" ] || [ ! -d "teatro-real-frontend" ]; then
    echo -e "${RED}Error: Ejecuta este script desde el directorio raíz del proyecto${NC}"
    exit 1
fi

# Verificar rama actual
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$ORIGIN_BRANCH" ]; then
    echo -e "${YELLOW}Advertencia: Estás en la rama '$CURRENT_BRANCH', no en '$ORIGIN_BRANCH'${NC}"
    read -p "¿Continuar? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Verificar cambios pendientes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}Hay cambios sin commitear:${NC}"
    git status --short
    echo ""
    read -p "¿Quieres hacer commit de estos cambios? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        read -p "Mensaje del commit: " COMMIT_MSG
        git add -A
        git commit -m "$COMMIT_MSG"
    else
        echo -e "${RED}Abortando. Haz commit de tus cambios primero.${NC}"
        exit 1
    fi
fi

# Push a GitLab (origin)
if [ "$PUSH_ORIGIN" = true ]; then
    echo -e "${BLUE}[1/4] Pushing a GitLab (origin/$ORIGIN_BRANCH)...${NC}"
    git push origin $ORIGIN_BRANCH || echo -e "${YELLOW}Warning: No se pudo push a origin${NC}"
else
    echo -e "${YELLOW}[1/4] Saltando push a GitLab (--no-push-origin)${NC}"
fi

# Deploy Backend
if [ "$DEPLOY_BACKEND" = true ]; then
    echo -e "${BLUE}[2/4] Desplegando Backend a GitHub (Render)...${NC}"

    # Actualizar subtree del backend
    git subtree split --prefix=teatro-real-backend -b backend-only --rejoin 2>/dev/null || true
    git push github backend-only:$GITHUB_BRANCH --force

    echo -e "${GREEN}✓ Backend pushed to GitHub${NC}"
    echo -e "  Render desplegará automáticamente desde: https://github.com/jotajota1302/teatro-real-backend"
else
    echo -e "${YELLOW}[2/4] Saltando deploy de Backend${NC}"
fi

# Deploy Frontend
if [ "$DEPLOY_FRONTEND" = true ]; then
    echo -e "${BLUE}[3/4] Desplegando Frontend a GitHub (Vercel)...${NC}"

    # Para el frontend, usamos vercel directamente (más rápido)
    cd teatro-real-frontend
    vercel --prod --yes 2>/dev/null || {
        echo -e "${YELLOW}Vercel CLI no disponible, usando git push...${NC}"
        cd ..
        git subtree split --prefix=teatro-real-frontend -b frontend-only --rejoin 2>/dev/null || true
        git push github-frontend frontend-only:$GITHUB_BRANCH --force
    }
    cd .. 2>/dev/null || true

    echo -e "${GREEN}✓ Frontend deployed${NC}"
else
    echo -e "${YELLOW}[3/4] Saltando deploy de Frontend${NC}"
fi

# Resumen
echo ""
echo -e "${BLUE}[4/4] Deploy completado!${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "${GREEN}URLs de producción:${NC}"
echo -e "  Frontend: https://teatro-real-frontend.vercel.app"
echo -e "  Backend:  https://teatro-real-backend.onrender.com"
echo -e "  Swagger:  https://teatro-real-backend.onrender.com/swagger-ui/index.html"
echo ""
echo -e "${YELLOW}Nota: Render (plan free) puede tardar ~30s en despertar si estaba dormido.${NC}"
