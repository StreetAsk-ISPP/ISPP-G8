# Meeting Minutes

## Header
- Date: 21/02/2026  
- Start time: 11:12  
- End time: 12:15
- Location / medium: Microsoft Teams  

## Participants
Miguel Arturo Mir Ceballos, Javier Pallarés González, Santia Bregu, Santiago Fernández Román, Óscar Gómez González, Darío Rodríguez Sastre, Darío Zafra Ruiz, Manuel Zoilo Buzón Muñoz, Raquel García Hortal, José María Silva Guzmán y resto del equipo.

## Administrators
- Miguel Arturo Mir Ceballos  
- Javier Pallarés González  
- Santia Bregu  
- Guillermo Linares

## Meeting Objective
- Reorganizar la metodología de trabajo tras el suspenso.
- Definir cómo se gestionarán las tareas del Sprint 1.
- Establecer normas claras para horas, documentación y presentación.
- Asegurar despliegue funcional y control del progreso.

---

# Decisions Made

---

## 1. Metodología de trabajo

- Las reuniones generales serán estilo **Daily**, con intervenciones breves.
- Los administradores moderan la reunión.
- Cada equipo debe tener su **reunión interna semanal obligatoria** para dividir épicas en tareas.
- Todo lo trabajado debe estar listo para mostrar los jueves.
- Modularización obligatoria del código para evitar conflictos.
- Las tareas deben cumplir la **Definition of Done**.

---

## 2. Gestión de Horas (CRÍTICO)

- Mínimo obligatorio: **10 horas semanales por persona**.
- Somos el único grupo que no llegó al mínimo → no puede volver a pasar.
- Las horas deben registrarse en:
  - Clockify (seguimiento de trabajo)
  - Excel interno (cálculo económico)
- Las reuniones también cuentan como horas (en ambos sistemas).
- No se va a perseguir a nadie para que suba horas: es responsabilidad individual.
- Las horas deben subirse al finalizar cada tarea, no al final del sprint.
- Se definirá próximamente el **rol de cada miembro** (para cálculo de costes).

---

## 3. Proyecto Base y Preparación Técnica

Antes de empezar con historias de usuario, se debe:

- Crear proyecto base de frontend.
- Crear estructura base modular para evitar conflictos.
- Configurar pipeline CI/CD (SonarQube, calidad, etc.).
- Preparar despliegue backend + frontend.
- La aplicación debe estar desplegada o se suspende el sprint.
- Para despliegue inicial se usará **Render** (para ahorrar créditos de Azure).
- Dockerización recomendada para facilitar despliegue futuro.

---

## 4. Épicas Sprint 1

Objetivo ideal: tenerlas listas este jueves para recibir feedback completo.

Incluyen:

- Registro de usuario.
- Login.
- Visualización en mapa.
- Publicación de preguntas con localización.
- Listado de preguntas.
- Publicación de respuestas.
- Expiración automática de preguntas.
- Validación de localización.

Si no se llega, se replanifica, pero no es lo ideal.

---

## 5. Presentación – Nuevo Sistema (DECISIÓN CLAVE)

Problema detectado:  
En el sprint anterior hubo incoherencias y descontrol porque cada uno hacía cosas distintas.

### Decisión final:

- **Las diapositivas NO las toca todo el mundo.**
- El grupo de presentación mantiene el control del PowerPoint.
- Cada persona que cierre una issue debe:
  - Documentarla en un documento compartido (Google Doc).
  - Incluir:
    - Nombre de la issue.
    - Qué se ha hecho.
    - Capturas.
    - Problemas encontrados.
    - Riesgos.
    - Tiempo dedicado.
- La tarea no se considera terminada hasta que esa documentación esté hecha.
- El grupo de presentación usa esa documentación para construir slides coherentes.
- Se creará:
  - Carpeta compartida.
  - Plantilla estándar para documentar issues.
- Raquel ya tiene una plantilla base para documentación.
- Se creará nueva plantilla visual alineada con el branding (colores coherentes con el logo).
- Se probará este sistema y si no funciona, se ajustará en el siguiente sprint.

---

## 6. Checklist de Presentación

Cada funcionalidad debe ayudar a alimentar:

- Progreso de desarrollo.
- Riesgos encontrados.
- Plan de mitigación.
- Stack tecnológico.
- Problemas reales encontrados.
- Evidencia con pantallazos reales.

La presentación debe mostrar proyecto, no solo funcionalidades.

---

## 7. Compromiso y Dedicación

- No dejar tareas para el último día.
- Todos dependemos de todos.
- Si alguien cumple solo las 10h pero no colabora ni responde, se tendrá en cuenta en el Dedication Template.
- Compromiso y proactividad son evaluables.

---

## 8. Organización Interna

- Cada representante debe asignar tareas a su equipo hoy mismo.
- Si algún equipo no recibe tareas, los admins las prepararán.
- Se hará ensayo general antes de cada evaluación para que todos sepan qué se va a decir.

---

# Open Points

- Definición formal de roles (programador, tester, PM, etc.).
- Estructura final del Excel económico.
- Ajustes visuales de plantilla.
- Verificación de correcto despliegue antes del jueves.

---

# Key Takeaways

1. No volver a suspender por desorganización.
2. 10h mínimas reales por persona.
3. Documentación obligatoria por issue.
4. Presentación centralizada.
5. Modularización y despliegue son críticos.
6. Todos somos responsables del resultado final.