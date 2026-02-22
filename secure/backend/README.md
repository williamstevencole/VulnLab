# VulnLab: Secure Backend Edition (Production Grade)

## 📌 Descripción General
Este es el **Backend Reforzado (Hardened)** del proyecto VulnLab. A diferencia de la versión del laboratorio diseñada para ser hackeada, este backend ha sido construido siguiendo las mejores prácticas de la industria y las recomendaciones del **OWASP Top 10**.

El objetivo de este módulo es servir como referencia técnica para demostrar cómo se mitigan las vulnerabilidades críticas en un entorno real utilizando Node.js, Express y Prisma.

---

## 🛡️ Arquitectura de Seguridad y Mitigaciones

A continuación se detallan las medidas de seguridad implementadas, los conceptos técnicos tras ellas y su aplicación práctica en el código.

### 1. Protección contra Inyección SQL (SQLi)
*   **Concepto:** La Inyección SQL ocurre cuando datos no confiables se envían a un intérprete como parte de un comando o consulta.
*   **Mitigación:** Se ha implementado **Prisma ORM**.
*   **Implementación:** En lugar de concatenar strings (`"WHERE id = " + id`), Prisma utiliza **Consultas Parametrizadas** de forma nativa. Esto separa la lógica de la consulta de los datos proporcionados por el usuario, haciendo que cualquier entrada maliciosa (como `' OR 1=1`) sea tratada simplemente como texto inofensivo.

### 2. Autenticación Robusta y Gestión de Sesiones (JWT)
*   **Concepto:** La autenticación rota permite a los atacantes comprometer contraseñas o tokens de sesión para asumir identidades de otros usuarios.
*   **Mitigación:** Implementación de **JSON Web Tokens (JWT)** y Middleware de Autenticación.
*   **Implementación:** Tras un login exitoso, el servidor genera un token firmado con una clave secreta (`JWT_SECRET`). Este token tiene un tiempo de expiración (2h). El cliente debe enviar este token en la cabecera `Authorization` para acceder a rutas protegidas. Se utiliza un middleware (`authenticateToken`) para validar la integridad del token en cada petición.

### 3. Prevención de IDOR (Insecure Direct Object Reference)
*   **Concepto:** IDOR ocurre cuando una aplicación utiliza un identificador para acceder directamente a un objeto sin una comprobación de autorización previa.
*   **Mitigación:** Verificación de **Propiedad de Recursos**.
*   **Implementación:** En rutas críticas (como `DELETE /posts/:id`), el backend no solo verifica que el usuario esté logueado, sino que extrae su ID del JWT y lo compara con el `user_id` del registro en la base de datos. Si no coinciden, la operación se deniega con un código `403 Forbidden`.

### 4. Protección de Credenciales (Bcrypt Hashing)
*   **Concepto:** Almacenar contraseñas en texto plano es una vulnerabilidad crítica. Si la base de datos es comprometida, todas las cuentas son expuestas inmediatamente.
*   **Mitigación:** Hashing adaptativo con **Bcrypt**.
*   **Implementación:** Se utiliza un factor de costo (Salt Rounds) de **12**. Bcrypt es un algoritmo diseñado para ser computacionalmente costoso, lo que ralentiza drásticamente los ataques de fuerza bruta y diccionarios de hashes, incluso si el atacante obtiene acceso a la tabla de usuarios.

### 5. Defensa contra Enumeración de Usuarios
*   **Concepto:** Revelar si un usuario existe o no a través de mensajes de error permite a un atacante listar cuentas válidas para futuros ataques.
*   **Mitigación:** **Respuestas Uniformes**.
*   **Implementación:** El backend ha sido configurado para responder con el mismo mensaje genérico (*"Invalid username or password"*) tanto si el usuario no existe como si la contraseña es incorrecta, eliminando la fuga de información.

### 6. Validación de Esquemas y Tipado (Zod)
*   **Concepto:** La falta de validación de entradas puede llevar a desbordamientos, inyecciones de datos o fallos en la lógica de negocio.
*   **Mitigación:** **Validación de Esquema Estricta** con Zod.
*   **Implementación:** Se definen objetos de esquema que dictan exactamente qué campos se esperan, su tipo (string, email, etc.) y su longitud. Si la petición no cumple con el esquema exacto, Zod la rechaza automáticamente con un error `400 Bad Request` antes de que el servidor intente procesarla.

### 7. Mitigación de Fuerza Bruta (Rate Limiting)
*   **Concepto:** Los ataques automatizados pueden intentar miles de combinaciones de credenciales en segundos.
*   **Mitigación:** **Limitación de Tasa (Rate Limiting)**.
*   **Implementación:** Se ha configurado un limitador que permite un máximo de **5 intentos de login cada 15 minutos** por dirección IP. Esto hace que los ataques de fuerza bruta sean logísticamente inviables.

### 8. Configuración de Seguridad HTTP (Helmet & CORS)
*   **Concepto:** Cabeceras HTTP mal configuradas pueden exponer a los usuarios a ataques de XSS, Sniffing o Clickjacking.
*   **Mitigación:** **Helmet.js** y **CORS Policy**.
*   **Implementación:**
    *   **Helmet:** Configura automáticamente cabeceras como `Content-Security-Policy` y `X-Frame-Options`.
    *   **CORS:** Restringe las peticiones cruzadas para que solo el dominio del frontend autorizado pueda comunicarse con la API.

---

## 🚀 Cómo ejecutar este Backend
1. Entra en la carpeta: `cd secure_backend`
2. Instala dependencias: `npm install`
3. Configura tu `.env` basándote en `.env.example`.
4. Genera el cliente de Prisma: `npx prisma generate`
5. Ejecuta: `npm start`
