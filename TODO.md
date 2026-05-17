# Hoja de Ruta (Roadmap) - RRHH Barrios Mineros

## ✅ Fase 1: Base y Dashboard (Completada)
- [x] Módulo Biométrico (Captura Cruda): `biometrico_config`, `biometrico_logs_raw`, `BiometricoService`
- [x] Dashboard Estratégico con gráficos Recharts (Composición Personal, Fuentes Financiamiento)
- [x] Tablas de catálogo: expediciones, profesiones, tipos_personal, fuentes_financiamiento, establecimientos
- [x] Tablas de asistencia: `asistencia_mensual`, `asistencia_diaria`
- [x] Tablas de biometría: `biometrico_config`, `biometrico_logs_raw`
- [x] Columna `biometrico_id` en tabla personal

## ✅ Fase 2: Gestión de Personal (Completada)
- [x] Grilla de personal con datos completos del Excel "Inventario Personal HBM"
- [x] Formulario de edición con todos los campos del Excel (datos personales + laborales)
- [x] Doble clic en fila para editar + botón de editar como alternativa
- [x] Dropdowns pre-seleccionados: establecimiento, tipo personal, fuente financiamiento, unidad/servicio
- [x] Campos condicionales: si fuente = MUNICIPIO, oculta cargo_escala y resumen_ejecutivo
- [x] Fecha de ingreso por defecto (hoy) si no tiene
- [x] Nuevo campo: `fecha_fin_contrato`
- [x] Importación desde Excel con mapeo automático de catálogos
- [x] Exportación a Excel
- [x] Historial de movimientos laborales

## ✅ Fase 3: Ordenamiento y Columnas Personalizables (Completada)
- [x] Ordenamiento ascendente/descendente por columnas (servidor)
- [x] Orden por defecto: registros más recientes primero (`id DESC`)
- [x] ColumnSelector con 14 columnas disponibles, persistencia en localStorage
- [x] Columnas: CI, Nombre, Tipo, Fuente, Ítem, Cargo, Cargo Planilla, Unidad, Carga Horaria, Profesión, Teléfono, F. Ingreso, F. Fin Contrato, Observaciones

## ✅ Fase 4: Sistema de Estados Activo/Inactivo (Completada)
- [x] Columnas `estado` (ACTIVO/INACTIVO) y `fecha_baja` en tabla personal
- [x] Filtro: Solo Activos / Todos / Solo Inactivos
- [x] Badge visual en grilla (verde = activo, rojo = inactivo)
- [x] Botón toggle activar/inactivar por registro
- [x] Cron job diario (01:00) que marca INACTIVO contratos vencidos automáticamente
- [x] Endpoint `GET /api/personal/contratos-alertas` para alertas

## ✅ Fase 5: Alertas en Dashboard (Completada)
- [x] Widget "Contratos Vencidos" (rojo) con lista de personal
- [x] Widget "Contratos por Vencer" (ámbar, próximos 30 días)
- [x] Widget "Personal Inactivo" (gris) con conteo activos/inactivos

## ✅ Fase 6: Módulo de Reportes (Completada)
- [x] Página `/reportes` con selector de reportes
- [x] Reporte "Inventario Personal HBM": formato igual al Excel original con encabezado institucional
- [x] Reporte "Contratos por Vencer": configurable por días
- [x] Filtros por estado, fuente, tipo, unidad
- [x] Exportación a Excel con formato profesional (bordes, colores, totales)
- [x] Backend: `reporteService.js`, `reporteController.js`, rutas `/api/reportes/*`

## 🔜 Fase Futura: Operación Diaria
- [ ] **Módulo de Turnos y Guardias:**
    - [ ] Diseño de tablas `turnos` y `roles_turno`
    - [ ] Creación de roles de turno
    - [ ] Asignación de personal a servicios específicos
- [ ] **Gestión de Vacaciones:**
    - [ ] Cálculo automático de días ganados por antigüedad
    - [ ] Formulario de solicitud y aprobación
- [ ] **Permisos y Bajas:**
    - [ ] Registro de bajas médicas y permisos particulares
    - [ ] Impacto automático en el consolidado de asistencia
- [ ] **Mapeo Biométrico:** Asignar IDs reales de equipos ZK a tabla personal
- [ ] **Cron Job Biométrico:** Descarga nocturna automática de logs

## 🔜 Fase Futura: Documentación y Salida
- [ ] **Certificaciones y Memorándums:** Generación automática de PDFs
- [ ] **Módulo de Reemplazos:** Gestión de personal externo para acefalías temporales
