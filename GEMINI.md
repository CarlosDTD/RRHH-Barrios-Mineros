# Proyecto: Sistema RRHH - Hospital Barrios Mineros (Oruro, Bolivia)

## Estado del Proyecto - 12 de Mayo, 2026 (Final de Sesión)

### 1. Arquitectura y Esquema
- **Base de Datos:** Ampliada en `vinculos_laborales` con campos técnicos: `cargo_planilla`, `cargo_escala`, `nro_resumen_ejecutivo`.
- **Backend:** `PersonalModel` y `ImportService` actualizados para soportar la gestión integral de datos de inventario.

### 2. Módulos Completados
- **Gestión de Personal Avanzada:**
  - Nueva "Ficha Técnica" en el frontend que permite editar todos los campos de identidad y laborales en una sola interfaz rápida.
- **Módulo de Importación Pro:**
  - Importación multi-hoja con detección dinámica de cabeceras.
  - Creación dinámica de catálogos (Profesiones).
  - Modal de reporte de errores detallado (CI, Hoja, Causa).

### 3. Pendientes Prioritarios
- [ ] Implementar el módulo de **Asistencias y Turnos** (Siguiente paso principal).
- [ ] Desarrollar la gestión de **Vacaciones y Permisos**.
- [ ] Mejorar la visualización de cargos técnicos en la tabla principal.

### 4. Cómo ejecutar el proyecto
- **Backend:** `cd backend && npm run dev`
- **Frontend:** `cd frontend && npm run dev`
