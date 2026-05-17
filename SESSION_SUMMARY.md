# Resumen de Sesión - 17 de Mayo, 2026

## Hitos Logrados

### 1. Corrección de Errores Críticos
- **Dashboard 500 Error:** Tablas `asistencia_mensual` y `asistencia_diaria` no existían → creadas en BD y `init.sql`
- **Contraseña DB:** `.env` tenía `virus`, corregido a `postgres`
- **Frontend crash:** Agregado manejo de errores con optional chaining (`?.`) y estado de error en Dashboard

### 2. Tablas de Biometría
- Creadas `biometrico_config` y `biometrico_logs_raw` en BD
- Agregada columna `biometrico_id` a tabla `personal`
- Actualizado `init.sql` con definiciones completas

### 3. Gestión de Personal - Mejoras Completas
- **Ordenamiento de columnas:** Click en header cicla ASC → DESC → default (más reciente primero)
- **Doble clic para editar:** Cada fila abre formulario de edición
- **Formulario completo:** Todos los campos del Excel "Inventario Personal HBM"
  - Dropdowns pre-seleccionados: establecimiento, tipo, fuente, unidad/servicio
  - Campos condicionales: MUNICIPIO oculta cargo_escala y resumen_ejecutivo
  - Nuevo campo: `fecha_fin_contrato`
  - Fecha ingreso por defecto = hoy si está vacía
  - Campo ID biométrico
- **Tabla `cat_unidades_servicios`:** 24 unidades del hospital creadas
- **Columna `unidad_servicio_id`:** Referencia a catálogo en `vinculos_laborales`

### 4. Sistema de Estados Activo/Inactivo
- Columnas `estado` (ACTIVO/INACTIVO) y `fecha_baja` en `personal`
- Filtro en grilla: Solo Activos / Todos / Solo Inactivos
- Badge visual verde/rojo en cada registro
- Botón toggle activar/inactivar por registro
- **Cron job diario** (`cron/estadoJob.js`): marca INACTIVO contratos vencidos a las 01:00
- **Alertas en Dashboard:** 3 widgets (vencidos, por vencer, inactivos)

### 5. Columnas Personalizables
- Componente `ColumnSelector.jsx`: panel con checkboxes para 14 columnas
- Persistencia en `localStorage` (preferencias se mantienen entre sesiones)
- Columnas: CI, Nombre, Tipo, Fuente, Ítem, Cargo, Cargo Planilla, Unidad, Carga Horaria, Profesión, Teléfono, F. Ingreso, F. Fin Contrato, Observaciones

### 6. Módulo de Reportes
- Nueva página `/reportes` con selector de reportes
- **Inventario Personal HBM:** Exporta Excel con formato institucional (mismo formato que libro original)
- **Contratos por Vencer:** Configurable por días (7-90)
- Filtros: estado, fuente, tipo, unidad
- Excel con encabezado institucional, bordes, colores alternados, totales
- Backend: `reporteService.js`, `reporteController.js`, rutas `/api/reportes/*`
- Link en Sidebar

## Archivos Nuevos Creados
| Archivo | Descripción |
|---|---|
| `backend/src/cron/estadoJob.js` | Cron job para inactivar contratos vencidos |
| `backend/src/services/reporteService.js` | Generación de reportes Excel |
| `backend/src/controllers/reporteController.js` | Controlador de reportes |
| `backend/src/routes/reporteRoutes.js` | Rutas de reportes |
| `frontend/src/components/ColumnSelector.jsx` | Selector de columnas personalizables |
| `frontend/src/pages/ReportesPage.jsx` | Página de reportes |

## Archivos Modificados
| Archivo | Cambios |
|---|---|
| `sql/init.sql` | Tablas asistencia, biometría, unidades_servicios, columnas estado/fecha_baja/fecha_fin_contrato |
| `backend/.env` | Corregida contraseña DB |
| `backend/src/index.js` | Import cron job y rutas de reportes |
| `backend/src/models/personalModel.js` | Filtro estado, nuevos campos en SELECT/CREATE/UPDATE |
| `backend/src/controllers/personalController.js` | Endpoints estado, contratos-alertas, auto-inactivar |
| `backend/src/routes/personalRoutes.js` | Nuevas rutas de estado y alertas |
| `backend/src/services/importService.js` | Mapeo unidad_servicio_id y fecha_fin_contrato |
| `frontend/src/pages/Dashboard.jsx` | Manejo de errores + widgets de alertas |
| `frontend/src/pages/PersonalPage.jsx` | Estado filter, columnas dinámicas, badge activo/inactivo, alertas |
| `frontend/src/components/PersonalForm.jsx` | Formulario completo con todos los campos del Excel |
| `frontend/src/components/Sidebar.jsx` | Link a Reportes |
| `frontend/src/App.jsx` | Ruta `/reportes` |

## Estado de la Base de Datos
- **Personal:** Registros existentes con estado ACTIVO por defecto
- **Tablas nuevas:** `asistencia_mensual`, `asistencia_diaria`, `biometrico_config`, `biometrico_logs_raw`, `cat_unidades_servicios`
- **Columnas nuevas:** `personal.estado`, `personal.fecha_baja`, `personal.biometrico_id`, `vinculos_laborales.fecha_fin_contrato`, `vinculos_laborales.unidad_servicio_id`

## Comandos de Inicio
- Ejecutar `start-project.cmd` en la raíz para levantar Backend (3001) y Frontend (5173)
- O manualmente: `cd backend && npm run dev` + `cd frontend && npm run dev`

## Git
- Todos los cambios commiteados y pusheados a `origin/main`
- Repo: https://github.com/CarlosDTD/RRHH-Barrios-Mineros
