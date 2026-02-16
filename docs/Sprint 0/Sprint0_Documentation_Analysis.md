# Análisis de Documentación Sprint 0

## 1. Inventario de Documentación

| Documento | Descripción | Objetivo Principal | Áreas que Cubre |
|-----------|-------------|-------------------|-----------------|
| **Business_plan.md** | Plan de negocio completo con modelo de monetización, análisis competitivo y roadmap | Definir viabilidad comercial y estrategia de mercado | Monetización, competencia, métricas, fases |
| **entities-definition.md** | Definición de entidades del sistema + Diagrama UML | Definir modelo de datos completo | Entidades, atributos, relaciones, diagrama visual |
| **development-guide.md** | Guía de desarrollo técnico | Definir arquitectura y tecnologías | Stack tecnológico, API, estructura de proyecto |
| **User_Acquisition_Plan_and_Growth_Roadmap.md** | Plan de adquisición y crecimiento en fases | Definir estrategia de crecimiento geográfico | Marketing guerrilla, retención, KPIs, gamificación |
| **pilot_users.md** | Lista de usuarios piloto para testing | Identificar testers externos | Lista de contactos, criterios de selección, roles |
| **Project_Tooling.md** | Herramientas de desarrollo | Listar herramientas del equipo | Gestión, diseño, comunicación, CI/CD |
| **Surveys.md** | Encuestas de validación | Validar hipótesis con usuarios reales | Preguntas, objetivos por bloque |
| **meetings/** | Actas de reuniones | Documentar decisiones | Decisiones de producto, funcionalidad |
| **presentations/** | Changelogs de presentaciones | Tracking de cambios en presentaciones | Evolución de slides, feedback |

> **Documentos eliminados por redundancia:**
> - ~~Value_proposition.md~~ → Contenido consolidado en Business_plan.md (secciones 1-4)
> - ~~Launch_User_Strategy.md~~ → Contenido consolidado en User_Acquisition_Plan_and_Growth_Roadmap.md
> - ~~uml-diagram.md~~ → Unificado con entities-definition.md

---

## 2. Análisis de Solapamientos y Redundancias

### ✅ Documentos Consolidados (Ya resueltos)

| Acción | Resultado |
|--------|-----------|
| Value_proposition.md + Business_plan.md | ✅ Eliminado Value_proposition (contenido en Business_plan secciones 1-4) |
| Launch_User_Strategy.md + User_Acquisition_Plan | ✅ Eliminado Launch_User_Strategy (consolidado en Growth Roadmap) |
| entities-definition.md + uml-diagram.md | ✅ Unificados en entities-definition.md |
| US-17 duplicada | ✅ Eliminada "List of nearby events", mantenida "Map toggle" |

### 🟢 Estado Actual de Documentación

| Documento | Estado |
|-----------|--------|
| **Business_plan.md** | ✅ Actualizado (sin Financial Projections, métricas corregidas) |
| **entities-definition.md** | ✅ Actualizado (incluye UML, sin ChatEvento) |
| **user-stories-and-use-cases.md** | ✅ Actualizado (US-17 única, US-48 añadida) |
| **WORK_PLAN.md** | ✅ Actualizado (sin Guest Mode, sprints reorganizados) |

---

## 3. Definición Global del MVP

Basándome en **TODA** la documentación analizada, esta es la definición consolidada del MVP:

### MVP Core (Sprint 1-2): Sistema Q&A Geolocalizado

**Funcionalidad Base - Sin Eventos:**

| Funcionalidad | User Story | Sprint | Descripción |
|---------------|------------|--------|-------------|
| Registro/Login | US-01, US-03 | S1 | Autenticación obligatoria con email/password |
| Perfil básico | US-06, US-04 | S1-S2 | Ver y editar información personal |
| Crear pregunta | US-08 | S1 | Punto en mapa + radio + topic obligatorio + texto |
| Ver preguntas en mapa | US-11 | S1 | Puntos rojos en mapa interactivo |
| Ver hilo de pregunta | US-13 | S1 | Mini-foro con respuestas ordenadas por rating |
| Responder preguntas | US-09 | S1 | Solo usuarios dentro del radio pueden responder |
| Like/Dislike respuestas | US-10 | S2 | Sistema de votación con cálculo de rating |
| Notificaciones básicas | US-12 | S2 | Pregunta cerca, respuesta a mi pregunta |
| Expiración automática | Sistema | S1 | 2 horas para usuarios free |

### MVP Extendido (Sprint 3): Eventos + Business + Gamificación

| Funcionalidad | User Story | Sprint | Descripción |
|---------------|------------|--------|-------------|
| Ver eventos en mapa | US-15, US-16 | S3 | Iconos visuales diferenciados de preguntas |
| Toggle preguntas/eventos | US-17 | S3 | Mostrar/ocultar preguntas (eventos siempre visibles) |
| Marcar asistencia | US-27 | S3 | Botón going/not going |
| Registro Business | US-28, US-48 | S3 | NIF + verificación admin + pago único |
| CRUD Eventos (Business) | US-29-32 | S3 | Solo cuentas business verificadas |
| Sistema de monedas | US-35, US-23 | S3 | 1 coin por respuesta, ±1 según likes/dislikes |
| Selección de plan | US-02 | S3 | UI Free vs Premium (sin pasarela real) |
| Panel Admin | US-37, US-39 | S3 | Métricas básicas + aprobar business |

---

## 4. Modelo de Precios - Análisis Comparativo

### Aplicaciones Similares Analizadas

| App | Modelo | Precio Free | Precio Premium | Precio Business |
|-----|--------|-------------|----------------|-----------------|
| **Nextdoor** | Freemium + B2B | Gratis | N/A | Publicidad desde $1/día |
| **Citizen** | Freemium | Gratis (alertas básicas) | $19.99/mes (Protect) | N/A |
| **Waze** | Freemium + B2B | Gratis con ads | N/A | Ads desde $2 CPM |
| **Eventbrite** | Transaccional | Gratis (eventos gratis) | 3.7% + $1.79/ticket | N/A |
| **Meetup** | Freemium | Asistir gratis | N/A | $16.99/mes (organizar) |
| **Yelp** | Freemium + B2B | Gratis | N/A | Desde $300/mes (ads) |
| **Discord Nitro** | Freemium | Gratis | $9.99/mes | Server Boost $4.99/mes |

### Propuesta de Planes para StreetAsk

#### 🆓 Plan FREE (Usuarios Normales)

| Característica | Incluido |
|----------------|----------|
| Ver mapa con preguntas y eventos | ✅ |
| Responder preguntas | ✅ |
| Crear preguntas | ✅ (con anuncio obligatorio antes) |
| Duración de preguntas | 2 horas fijas |
| Notificaciones | Básicas |
| Ganar monedas | ✅ |
| Marcar asistencia a eventos | ✅ |

#### ⭐ Plan PREMIUM (Usuarios Normales)

| Característica | Incluido | Precio Sugerido |
|----------------|----------|-----------------|
| Todo de FREE | ✅ | |
| Sin anuncios | ✅ | |
| Duración configurable (hasta 24h) | ✅ | |
| Notificaciones prioritarias | ✅ | |
| Insignias exclusivas | ✅ | |
| **Precio mensual** | | **€4.99/mes** |
| **Precio anual** | | **€39.99/año** (33% descuento) |

*Justificación: Precio similar a Discord Nitro Basic, accesible para público joven (18-35)*

#### 🏢 Plan BUSINESS (Empresas/Organizadores)

| Característica | Incluido | Precio Sugerido |
|----------------|----------|-----------------|
| Todo de PREMIUM automático | ✅ | |
| Crear eventos | ✅ | |
| Gestión de eventos (CRUD) | ✅ | |
| Respuestas verificadas (badge) | ✅ | |
| Estadísticas básicas de eventos | ✅ | |
| **Pago único de activación** | | **€99** |

*Justificación: Pago único como barrera de entrada seria que filtra spam, más económico que suscripción mensual de Meetup (€16.99/mes = €203/año)*

#### 💎 Opciones Premium Adicionales (Post-MVP)

| Feature | Precio | Modelo |
|---------|--------|--------|
| Destacar evento (sponsorship) | €15-60/evento | Pay-per-use |
| Destacar pregunta | €0.50/pregunta | Pay-per-use |
| Dashboard analytics avanzado | €29.99/mes | Suscripción |
| Eventos recurrentes | Incluido en Business+ | €149 pago único |

---

## 5. Resumen Ejecutivo

### Idea Global del MVP

**StreetAsk** es una plataforma de inteligencia social en tiempo real que permite a los usuarios hacer preguntas geolocalizadas y recibir respuestas verificadas de personas físicamente presentes en esa ubicación.

**Core Value Proposition:**
- **Para usuarios**: Eliminar la incertidumbre sobre lugares/eventos antes de ir
- **Para negocios**: Visibilidad contextual y comunicación directa con clientes potenciales cercanos

**Diferenciación clave:**
1. **Proof of Presence**: Solo responden usuarios en la ubicación
2. **Información efímera**: Datos frescos, no reviews históricas
3. **Mini-forums por pregunta**: Hilos con votación, no chat

### Fases de Monetización

| Fase | Timing | Modelo |
|------|--------|--------|
| **MVP (S1-S3)** | Meses 1-4 | 100% gratuito, validar producto |
| **Monetización inicial** | Meses 5-9 | Premium users + Business accounts |
| **Expansión** | Meses 10-18 | Ads opcionales + destacados pagados |

### Documentos a Consolidar (Recomendación)

✅ **COMPLETADO:**
1. ~~Fusionar Launch_User_Strategy.md + User_Acquisition_Plan_and_Growth_Roadmap.md~~ → Eliminado Launch_User_Strategy
2. ~~Actualizar uml-diagram.md~~ → Unificado con entities-definition.md
3. ~~Sincronizar Business_plan.md MVP section~~ → Actualizado
4. ~~Corregir US-17 duplicada~~ → Eliminada "List of nearby events"
5. ~~Eliminar Value_proposition.md~~ → Contenido ya en Business_plan
