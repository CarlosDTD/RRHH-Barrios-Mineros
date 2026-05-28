# Hoja de Ruta (Roadmap)

## Fase Actual: Módulos de Operación Diaria
- [x] **Módulo Biométrico (Captura Cruda):**
    - [x] Instalación de `node-zklib`.
    - [x] Creación de tablas `biometrico_config` y `biometrico_logs_raw`.
    - [x] Implementación de `BiometricoService` para descarga de marcaciones.
    - [x] Interfaz de usuario para configuración y monitoreo de logs.
- [x] **Módulo de Turnos y Guardias:**
    - [x] Diseño de tablas `cat_tipos_turno`, `roles_turno`, `personal_roles_turno`, `planilla_turnos`, `jefes_servicio`.
    - [x] CRUD de roles de turno por servicio.
    - [x] Asignación de personal a roles con prioridad por fuente (TGN > HIPC > MINISTERIO > CONTRATO).
    - [x] Planilla mensual con vista calendario por día.
    - [x] Generación automática de planilla con algoritmo de prioridad.
    - [x] Asignación manual de personal a turnos.
    - [x] Excel y PDF export.
    - [x] Roles JEFE_SERVICIO (gestiona su servicio) + JEFE_RRHH (gestiona todo).
- [ ] **Gestión de Vacaciones:**
    - [ ] Cálculo automático de días ganados por antigüedad.
    - [ ] Formulario de solicitud y aprobación.
- [ ] **Permisos y Bajas:**
    - [ ] Registro de bajas médicas y permisos particulares.
    - [ ] Impacto automático en el consolidado de asistencia.

## Fase Futura: Documentación y Salida
- [ ] **Certificaciones y Memorándums:** Generación automática de PDFs.
- [ ] **Módulo de Reemplazos:** Gestión de personal externo para cubrir acefalías temporales.
