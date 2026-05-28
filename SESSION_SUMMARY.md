# Resumen de Sesión - 28 de Mayo, 2026

## Hitos Logrados
1. **Módulo de Turnos y Guardias (Completo):**
   - Diseño e implementación de BD: `cat_tipos_turno`, `roles_turno`, `personal_roles_turno`, `planilla_turnos`, `jefes_servicio`.
   - Backend: CRUD completo de roles de turno por servicio, asignación de personal autorizado, planilla mensual.
   - Algoritmo de generación automática con prioridad por fuente de financiamiento (TGN > HIPC > MINISTERIO > MUNICIPIO > CONTRATO) + distribución justa.
   - Exportación a Excel y PDF.
   - Frontend con 3 tabs: Roles de Turno (gestión), Planilla (calendario mensual visual), Exportar.
   - Roles de seguridad: `JEFE_SERVICIO` (gestiona su servicio) y `JEFE_RRHH`/`ADMIN` (gestionan todo).
   - Detección automática de jefes de servicio por cargo (`JEFE`, `DIRECTOR`, `RESPONSABLE`, etc.).

## Estado de la Base de Datos
- Tablas nuevas: `cat_tipos_turno` (4 tipos: M, T, N, G24), `roles_turno`, `personal_roles_turno`, `planilla_turnos`, `jefes_servicio`.
- Rol nuevo: `JEFE_SERVICIO` con permiso `turnos.gestionar`.
- Permisos: `turnos.ver` (lectura) y `turnos.gestionar` (escritura).

## Pendientes para la Próxima Sesión
- **Vacaciones:** Cálculo automático de días ganados por antigüedad + solicitud/aprobación.
- **Permisos y Bajas:** Bajas médicas, permisos particulares, impacto en asistencia.
- **Mapeo Biométrico:** Asignar IDs reales de equipos ZK a la tabla `personal`.
- **Reemplazos:** Gestión de personal externo para cubrir acefalías.

## Comandos de Inicio
- Ejecutar `start-project.cmd` en la raíz para levantar Backend (3001) y Frontend (5173).
