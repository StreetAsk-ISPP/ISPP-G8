#!/bin/bash
# Script para limpiar caché de Java en VS Code (macOS/Linux)
# Ejecutar si aparecen errores falsos de dependencias en VS Code

echo -e "\033[33mLimpiando cache de Java Language Server...\033[0m"

# Detectar OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    VSCODE_STORAGE="$HOME/Library/Application Support/Code/User/workspaceStorage"
else
    VSCODE_STORAGE="$HOME/.config/Code/User/workspaceStorage"
fi

# Limpiar cache del Java Language Server
if [ -d "$VSCODE_STORAGE" ]; then
    find "$VSCODE_STORAGE" -type d -name "redhat.java" -exec rm -rf {} + 2>/dev/null
    echo -e "\033[32mCache de Java Language Server eliminado\033[0m"
fi

# Limpiar target de Maven
if [ -d "target" ]; then
    rm -rf target
    echo -e "\033[32mEliminado: target/\033[0m"
fi

echo ""
echo -e "\033[36mCache limpiado. Ahora:\033[0m"
echo "1. Abre VS Code"
echo "2. Espera a que Java Language Server se reinicie (~30 segundos)"
echo "3. Si aun hay errores, presiona Cmd+Shift+P (macOS) o Ctrl+Shift+P (Linux)"
echo "   y ejecuta 'Java: Clean Java Language Server Workspace'"
