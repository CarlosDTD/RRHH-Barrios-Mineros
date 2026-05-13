# Proyecto: Sistema RRHH - Hospital Barrios Mineros (Oruro, Bolivia)

## Estado del Proyecto - 12 de Mayo, 2026

### 1. Arquitectura Implementada
- **Backend:** Node.js + Express (Arquitectura por capas: Modelos, Controladores, Rutas, Servicios).
- **Frontend:** React + Vite + Tailwind CSS v4.
- **Base de Datos:** PostgreSQL (Normalizada con tablas de catálogo).

### 2. Módulos Completados
- **Gestión de Personal y Vínculos:**
  - CRUD transaccional unificado.
  - Búsqueda Global Avanzada y Filtros dinámicos.
  - Módulo de Trayectoria Laboral con historial JSONB.
- **Módulo de Importación Avanzada (NUEVO):**
  - **Detección Dinámica de Encabezados:** Soporta archivos Excel con metadatos superiores y variaciones en nombres de columnas.
  - **Procesamiento Multi-Hoja:** Importación automática de libros con múltiples pestañas (SEDES, MINISTERIO, CONTRATOS, etc.).
  - **Catálogos Inteligentes:** Creación automática de nuevas profesiones en `cat_profesiones` durante la importación.
  - **UI de Resultados:** Modal detallado que muestra conteo de éxitos y log de errores específico (CI, Hoja, Causa del fallo).
  - **Integridad Referencial:** Mapeo automático de Expediciones, Fuentes de Financiamiento y Tipos de Personal (Ítem/Contrato).

### 3. Credenciales de Base de Datos
- **DB Name:** `rrhh_barrios_mineros`
- **User:** `postgres`
- **Password:** `postgres`
- **Host:** `localhost`
- **Port:** `5432`

### 4. Próximos Pasos (Pendientes)
- [ ] Implementar el módulo de **Asistencias y Turnos**.
- [ ] Desarrollar la gestión de **Vacaciones y Permisos**.
- [ ] Implementar **Certificaciones y Memorándums**.

### 5. Cómo ejecutar el proyecto
- **Backend:** `cd backend && npm run dev` (Puerto 3001)
- **Frontend:** `cd frontend && npm run dev` (Puerto 5173)
- **Tests:** `cd backend && $env:NODE_ENV='test'; npx jest`
