<!--
Sync Impact Report
- Version change: N/A -> 1.0.0
- Modified principles:
  - Added: I. Calidad y mantenibilidad por defecto
  - Added: II. Pruebas proporcionales al riesgo
  - Added: III. Seguridad y validacion en todos los limites
  - Added: IV. Observabilidad operativa minima
  - Added: V. Rendimiento y accesibilidad verificables
- Added sections:
  - Restricciones y estandares fullstack
  - Flujo de entrega y quality gates
- Removed sections: Ninguna
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ✅ .github/agents/speckit.constitution.agent.md (validada, sin cambios)
- Follow-up TODOs: Ninguno
-->

# DescubreSucre Constitution

## Core Principles

### I. Calidad y mantenibilidad por defecto
Cada cambio MUST priorizar legibilidad, simplicidad y mantenibilidad a largo
plazo sobre la velocidad de entrega. Todo codigo nuevo MUST incluir nombres
claros, estructura coherente y limites de complejidad razonables. Refactors
pequenos de saneamiento SHOULD hacerse dentro del mismo cambio cuando reduzcan
riesgo tecnico sin ampliar el alcance funcional.

### II. Pruebas proporcionales al riesgo
Todo cambio MUST demostrar evidencia de calidad con pruebas acordes al impacto.
Cambios de logica de negocio, autenticacion, autorizacion, pagos, integraciones,
persistencia o migraciones MUST incluir pruebas automatizadas. Cambios de bajo
riesgo (texto, estilos menores, copy) MAY validar con verificacion manual
documentada. Ningun cambio critico puede considerarse terminado sin pruebas que
fallen antes de corregir y pasen despues.

### III. Seguridad y validacion en todos los limites
Toda entrada externa MUST validarse y sanearse en el limite correspondiente
(UI, API, jobs, webhooks). Rutas administrativas y operaciones sensibles MUST
aplicar autenticacion y autorizacion explicitas. Secretos, tokens y credenciales
MUST gestionarse via variables de entorno y nunca almacenarse en codigo fuente.
Los errores expuestos al cliente MUST evitar filtraciones de informacion interna.

### IV. Observabilidad operativa minima
Las rutas, procesos y jobs criticos MUST emitir logs estructurados con contexto
suficiente para rastrear fallas y tiempos de ejecucion. Errores MUST registrarse
con severidad y metadata accionable. Cada feature nueva SHOULD definir una forma
de diagnostico basica (logs, metricas o trazas) antes de considerarse lista.

### V. Rendimiento y accesibilidad verificables
Las funcionalidades orientadas al usuario MUST definir criterios medibles de
rendimiento y accesibilidad en su especificacion. UI interactiva MUST conservar
navegacion por teclado, etiquetas semanticas y contraste legible. Cambios que
degraden tiempos de respuesta o experiencia de uso MUST justificarse y incluir
plan de mitigacion.

## Restricciones y estandares fullstack

- La arquitectura base del producto es Next.js App Router con TypeScript.
- Los endpoints y route handlers MUST separar validacion, logica y acceso a datos.
- El acceso a base de datos MUST centralizarse con patrones consistentes y
  migraciones versionadas cuando aplique.
- Todo entorno MUST configurarse por variables (`.env*`) con ejemplos actualizados.
- Dependencias nuevas MUST justificarse por necesidad real y mantenimiento activo.
- Cambios con impacto de despliegue MUST incluir pasos de rollout y rollback.

## Flujo de entrega y quality gates

El flujo oficial del proyecto es: `/speckit.specify` -> `/speckit.plan` ->
`/speckit.tasks` -> `/speckit.implement`.

Definition of Done minima por cambio:

1. Requisitos y criterios de aceptacion definidos y trazables.
2. Riesgos de seguridad y validacion cubiertos.
3. Pruebas requeridas ejecutadas y registradas.
4. Observabilidad minima incorporada para el comportamiento critico.
5. Documentacion y configuraciones afectadas actualizadas.

Quality gates obligatorios:

- Gate de diseno: la especificacion MUST incluir escenarios, edge cases y
  criterios medibles.
- Gate de implementacion: los cambios MUST pasar checks de lint/type/test
  aplicables al alcance.
- Gate de revision: todo PR MUST verificar cumplimiento de esta constitucion.

## Governance

Esta constitucion prevalece sobre practicas informales del repositorio. Toda
enmienda MUST incluir razon, impacto esperado y actualizacion sincronizada de
plantillas o guias afectadas.

Politica de versionado de la constitucion:

- MAJOR: cambios incompatibles en principios o gobernanza.
- MINOR: incorporacion de nuevos principios o secciones normativas.
- PATCH: aclaraciones editoriales sin cambio normativo.

Revision de cumplimiento:

- Cada plan de implementacion MUST incluir un Constitution Check explicito.
- Cada lote de tareas SHOULD mapear pruebas, seguridad y observabilidad cuando
  el cambio lo requiera.
- Si una excepcion es necesaria, MUST documentarse con justificacion y
  compensaciones.

**Version**: 1.0.0 | **Ratified**: 2026-04-16 | **Last Amended**: 2026-04-16
