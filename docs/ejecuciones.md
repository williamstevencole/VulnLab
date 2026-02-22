# Guía de Ejecución (Instructor)

## Fase 1: Preparación
1. `docker-compose up --build` (Importante: Instala `recharts` y `lucide-react`).
2. Abrir `http://localhost:5173`.

## Fase 2: Puntos de la Presentación
1. **Contraste de Código:** Muestra `/login` (vulnerable) vs `/signup` (seguro) en `backend/server.js`.
2. **El "Escalamiento de Privilegios" (Demo Principal):**
   - Realiza la inyección `admin' --`.
   - **Impacto:** Resalta cómo la UI cambia radicalmente al entrar al **Admin Dashboard**.
   - Muestra las **Stat Cards** y la **Gráfica de barras** (Recharts). Explica que un atacante ahora tiene control total y visibilidad del sistema.
3. **Exfiltración de Datos:** Muestra la tabla `DATABASE_USER_DUMP` en el dashboard. Explica que la vulnerabilidad SQLi permitió al atacante ver la lista completa de usuarios sin permiso.

## Fase 3: Conclusión
- Muestra `backend/recommendations.js`.
- Explica que el Dashboard es una herramienta de administración real que ha sido comprometida.
