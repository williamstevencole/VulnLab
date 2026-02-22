# Laboratorio de Pentesting: SQL Injection (SQLi)

## 1. Requisitos
- ParrotOS / Kali
- `nmap`, `sqlmap`

## 2. Reconocimiento
Accede a `http://<IP_OBJETIVO>:5173`. Tu objetivo es el **SYSTEM_ADMIN_OVERRIDE**.

## 3. Reto 1: Bypass Manual
Intenta entrar como administrador inyectando código en el login.
- **Pista:** `admin' --`
- Si lo logras, verás un panel con gráficas y estadísticas rojas. Eso significa que has comprometido el sistema a nivel de administración.

## 4. Reto 2: Extracción con SQLMap
Ataque al backend (puerto 3000):

**Ver estadísticas internas (Tablas):**
```bash
sqlmap -u "http://<IP_OBJETIVO>:3000/login" --data '{"username":"admin","password":"123"}' --method POST --batch -D pentest_db --tables
```

**Reto de datos:**
1. ¿Cuál es la categoría que tiene más posts según la gráfica del dashboard?
2. Usa `sqlmap` para volcar la tabla `users` y encontrar el email del usuario con `id=10`.
3. ¿Cuántos comentarios totales (`LOGGED_COMMENTS`) reporta el dashboard? Verifica este número volcando la tabla `comments`.

## 5. El Objetivo Final
Demuestra cómo una simple comilla `'` puede dar acceso a un panel de control corporativo completo con gráficas, métricas y datos privados de usuarios.
