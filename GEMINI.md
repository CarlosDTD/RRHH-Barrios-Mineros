# Proyecto: Sistema RRHH - Hospital Barrios Mineros (Oruro, Bolivia)

## Estado del Proyecto - 10 de Mayo, 2026

### 1. Arquitectura Implementada
- **Backend:** Node.js + Express (Arquitectura por capas: Modelos, Controladores, Rutas, Servicios).
- **Frontend:** React + Vite + Tailwind CSS v4.
- **Base de Datos:** PostgreSQL (Normalizada con tablas de catálogo).

### 2. Módulos Completados (Gestión de Personal)
- **Base de Datos:**
  - Tablas: `personal`, `establecimientos`, `vinculos_laborales`, y catálogos (`expediciones`, `profesiones`, `tipos_personal`, `fuentes`).
  - Script de inicialización y seed de datos de prueba completado.
- **Backend API:**
  - CRUD completo para la tabla `personal`.
  - Filtros dinámicos por CI y Nombre/Apellido.
  - Sanitización de datos (conversión de strings vacíos a NULL).
  - Servicio de Exportación a Excel (`exceljs`) con todos los campos y estilos.
  - Servicio de Importación de Excel (`xlsx`) con mapeo automático de catálogos y parseo de fechas.
  - Tests de integración con `Jest` y `Supertest` (4 tests pasando).
- **Frontend UI:**
  - Layout con Sidebar y navegación funcional (Lucide React).
  - Grid de personal con visualización detallada (CI con complemento, nombres completos, fechas formateadas).
  - Formulario modal para Registro/Edición con validación y selección de catálogos.

### 3. Credenciales de Base de Datos
- **DB Name:** `rrhh_barrios_mineros`
- **User:** `postgres`
- **Password:** `postgres`
- **Host:** `localhost`
- **Port:** `5432`

### 4. Pendientes para Mañana
- [ ] Implementar el módulo de **Vínculos Laborales** (Asignar personal a establecimientos, cargos, tipos de contrato y unidades).
- [ ] Diseñar la lógica de **Asistencias y Turnos**.
- [ ] Desarrollar la gestión de **Vacaciones y Permisos**.
- [ ] Implementar **Certificaciones y Memorándums**.

### 5. Cómo ejecutar el proyecto
- **Backend:** `cd backend && npm run dev` (Puerto 3001)
- **Frontend:** `cd frontend && npm run dev` (Puerto 5173)
- **Tests:** `cd backend && $env:NODE_ENV='test'; npx jest`
