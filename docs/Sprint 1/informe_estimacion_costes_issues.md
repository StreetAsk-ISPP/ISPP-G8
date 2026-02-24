# Informe de Estimación de Tiempo y Coste por Issues

Fecha: 24/02/2026  
Proyecto: ISPP-G8  
Supuestos económicos:
- Desarrollador Full-Stack: **12,50 €/h**
- Project Manager: **14,80 €/h**
- PMs considerados: **4 PMs (horas combinadas)**

## Contexto de capacidad y criterio de ajuste

- Equipo total: **20 personas**
- Dedicación comprometida: **10 h/semana por persona**
- Tiempo transcurrido: **3 semanas**
- Capacidad total teórica: **600 h**

Dado que existen tareas de coordinación/seguimiento/soporte no reflejadas como issues, se reduce la carga directa por issue y se añade una partida transversal (reuniones, gestión, QA y retrabajo) para llevar la estimación consolidada a **~500 h totales**.

## Estimación por issue

| ID/Nombre de la Issue | Estimación Horas Dev | Coste Dev (€) | Estimación Horas PMs (los 4 combinados) | Coste PMs (€) | Coste Total de la Issue (€) |
|---|---:|---:|---:|---:|---:|
| 1. [DOCS]: Study new functionalities to add to the app to upgrade the premium plan | 14 | 175,00 | 8 | 118,40 | 293,40 |
| 2. [DOCS]: RACI Matrix | 8 | 100,00 | 5 | 74,00 | 174,00 |
| 3. [DOCS]: Fix presentation (#67) | 6 | 75,00 | 4 | 59,20 | 134,20 |
| 4. docs: Update changelog presentation 19/02 | 4 | 50,00 | 3 | 44,40 | 94,40 |
| 5. [DOCS]: unify visual style and slide appearance | 10 | 125,00 | 6 | 88,80 | 213,80 |
| 6. [DOCS]: design Minimum Viable Product (MVP) slides | 8 | 100,00 | 5 | 74,00 | 174,00 |
| 7. [DOCS]: design core functionalities slides | 8 | 100,00 | 5 | 74,00 | 174,00 |
| 8. [DOCS]: Definir Stack Tecnológico para el Frontend | 9 | 112,50 | 5 | 74,00 | 186,50 |
| 9. [DOCS]: Change Git workflow of the presentation | 5 | 62,50 | 3 | 44,40 | 106,90 |
| 10. Feature/ci | 20 | 250,00 | 12 | 177,60 | 427,60 |
| 11. docs: update presentation changelog | 4 | 50,00 | 3 | 44,40 | 94,40 |
| 12. docs: Add pricing | 7 | 87,50 | 4 | 59,20 | 146,70 |
| 13. [DOCS]: Tools slide | 5 | 62,50 | 3 | 44,40 | 106,90 |
| 14. [DOCS]: create SWOT analysis slide - Internal Factors | 5 | 62,50 | 3 | 44,40 | 106,90 |
| 15. [DOCS]: create SWOT analysis slide - External Factors | 5 | 62,50 | 3 | 44,40 | 106,90 |
| 16. docs: add commitment agreement | 4 | 50,00 | 3 | 44,40 | 94,40 |
| 17. docs: dp deliverable | 7 | 87,50 | 4 | 59,20 | 146,70 |
| 18. docs: update changelog 17/02 | 4 | 50,00 | 3 | 44,40 | 94,40 |

## Horas transversales no trazadas en issues (añadidas al presupuesto)

| Concepto transversal | Horas Dev | Coste Dev (€) | Horas PMs (4 combinados) | Coste PMs (€) | Coste Total (€) |
|---|---:|---:|---:|---:|---:|
| Reuniones de seguimiento y sincronización | 80 | 1.000,00 | 40 | 592,00 | 1.592,00 |
| Planificación (sprint planning, refinamiento, coordinación inter-equipos) | 30 | 375,00 | 40 | 592,00 | 967,00 |
| QA funcional, revisiones cruzadas, bloqueos y retrabajo | 67 | 837,50 | 28 | 414,40 | 1.251,90 |
| **Total horas/coste transversales** | **177** | **2.212,50** | **108** | **1.598,40** | **3.810,90** |

## Resumen Financiero

- **Horas Dev en issues:** 133 h
- **Coste Dev en issues:** 1.662,50 €
- **Horas PMs en issues (4 combinados):** 82 h
- **Coste PMs en issues:** 1.213,60 €
- **Horas totales del bloque issues:** 215 h
- **Coste total del bloque issues:** 2.876,10 €

- **Horas Dev transversales añadidas:** 177 h
- **Coste Dev transversal:** 2.212,50 €
- **Horas PMs transversales añadidas (4 combinados):** 108 h
- **Coste PMs transversal:** 1.598,40 €
- **Horas transversales añadidas:** 285 h
- **Coste transversal añadido:** 3.810,90 €

- **Horas Dev totales (issues + transversal): 310 h**
- **Coste Dev total (issues + transversal): 3.875,00 €**
- **Horas PMs totales (issues + transversal): 190 h**
- **Coste PMs total (issues + transversal): 2.812,00 €**
- **Horas totales estimadas consolidadas: 500 h**
- **Coste total estimado consolidado: 6.687,00 €**

## Análisis crítico breve

- Se reduce la carga por issue a **215 h** para reflejar mejor el carácter documental de gran parte del backlog.
- Se añade una bolsa explícita de **285 h transversales** (reuniones, gestión, QA y retrabajo) para representar trabajo real no trazado en issues.
- Con ello, el presupuesto queda en **500 h totales**, coherente con el esfuerzo de 3 semanas y evitando inflar artificialmente cada issue individual.
- El peso de PM (190 h) sigue siendo alto; puede justificarse parcialmente por la coordinación de 20 personas, pero conviene vigilarlo para no penalizar la eficiencia del coste técnico.
