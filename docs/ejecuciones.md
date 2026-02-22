# Guía de Ejecución (Instructor)

## Fase 1: Preparación
1. `docker-compose up --build`
   - Esto levanta el **Frontend** (React) y el **Backend Vulnerable** (organizado por rutas).
2. Abrir `http://localhost:5173`.

## Fase 2: Puntos de la Presentación
1. **Organización del Proyecto (Clean Architecture):**
   - Muestra la carpeta `backend/`. Explica que ahora está dividida en `routes/`, `db/` y `server.js` para ser más profesional.
   - Resalta que, a pesar de estar bien organizado, sigue teniendo el fallo de concatenación en `backend/routes/auth.js`.

2. **Comparación con el Backend Seguro (EL "PLATO FUERTE"):**
   - Abre la carpeta `secure_backend/` (que no está corriendo, solo para mostrar código).
   - **Punto A (Validación):** Muestra `secure_backend/routes/auth.js` y explica cómo **Zod** valida que los datos sean correctos antes de procesarlos.
   - **Punto B (ORM Prisma):** Muestra cómo Prisma sustituye el SQL manual por funciones seguras que previenen SQLi.
   - **Punto C (Bcrypt):** Explica que aquí las contraseñas no se ven, están hasheadas.
   - **Punto D (Seguridad HTTP):** Muestra en `server.js` el uso de **Helmet** y **CORS**.

3. **Demostración de la Vulnerabilidad:**
   - Realiza el ataque `admin' --` en el sitio vivo.
   - Muestra los logs de la terminal para que vean la consulta concatenada.

## Fase 3: Conclusión
- Explica que una buena organización (routers) no sirve de nada si la lógica de acceso a datos es insegura.
