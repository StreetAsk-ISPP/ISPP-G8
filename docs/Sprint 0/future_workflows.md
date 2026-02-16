# Workflows de GitHub Actions

Este documento resume los posibles flujos de trabajo (`workflows`) para nuestro proyecto, integrando linting, testing y análisis de calidad de código.

---

## 1. Linting con ESLint
**Objetivo:**  
Verificar que el código JavaScript/TypeScript cumpla con las reglas de estilo definidas antes de hacer merge a la rama principal.

**Disparadores:**  
- Push a cualquier rama  
- Pull request hacia `main` y `trunk`

---

## 2. Tests con Pytest
**Objetivo:**  
Ejecutar la suite de pruebas de Python para garantizar la estabilidad y correcto funcionamiento del código.

**Disparadores:**  
- Push a cualquier rama  
- Pull request hacia `main` y `trunk`

---

## 3. Análisis de código con Codacy
**Objetivo:**  
Evaluar la calidad de código y reportar problemas de estilo, complejidad y seguridad.

**Disparadores:**  
- Push a cualquier rama  
- Pull request hacia `main` y `trunk`

---

## 4. Posibles mejoras futuras
- Integración de Dependabot para actualizar dependencias automáticamente.  
- Notificaciones a Slack/Teams sobre resultados de los workflows.  
- Tests en múltiples versiones de Python y Node.js.  
- Workflow de despliegue automatizado al merge en `trunk (preproducción)` y `main (producción)`.
