# Serial Device Communication Demo

A small, standalone demonstration of a serial communication feature I contributed to for a **telemedicine platform**. This is a learning and portfolio project, **not the original application, the production code used in that platform, or the complete application**.

## What the application does

The web interface has three sections:

- **Usuarios (Users):** create and list user records with name, surname, age, and profession.
- **Dispositivos (Devices):** create and list device records with name, code, and manufacturer.
- **Resultados y reportes (Results and reports):** connect to a serial device, request a response, display the received byte values, save them as a record, and inspect saved records.

The user and device catalogs are currently separate from serial records; a result record is not linked to a particular user or device.

## Serial communication flow

The browser uses the **Web Serial API** to communicate with a USB serial device:

1. The user selects a serial port in the browser.
2. The page opens the port at **9600 baud**.
3. When **Read** is pressed, the page sends one request byte: `0x41` (`A`).
4. After a fixed 1.5-second delay, the page reads one available serial chunk and displays its bytes as decimal values.
5. When **Save** is pressed, the browser posts the received values as a JSON array to Django. Django creates a record code such as `REG-0001` and stores each value as a separate row.
6. The results list can retrieve and display the saved values.

This demo treats incoming data as **raw bytes**. It does not decode the device's proprietary format, assign units, or convert values into clinical measurements. The current reader consumes one chunk rather than assembling a framed stream, so it is intended for a controlled demonstration response, not as a robust serial protocol implementation.

## Arduino test firmware

[`arduino/firmware_prueba/firmware_prueba.ino`](arduino/firmware_prueba/firmware_prueba.ino) is a test emulator for an Arduino Uno, Nano, or compatible board. It waits for `0x41` and responds with nine artificial bytes:

```text
10, 20, 30, 40, 50, 60, 70, 80, 90
```

The firmware provides repeatable test input only; it does not emulate a real medical device or the proprietary protocol. See [`arduino/README.md`](arduino/README.md) for upload instructions.

## Technology and architecture

- **Django 5.2** serves the page and JSON endpoints. Django ORM models store users, devices, result records, and individual data values in SQLite.
- **React 18** renders the browser interface. The app is composed of `App`, `Usuarios`, `Dispositivos`, and `Resultados` components, with separate table components for user and device listings.
- **Babel Standalone** transpiles JSX in the browser. React, ReactDOM, Babel, Bootstrap, and Font Awesome are loaded from CDNs; an internet connection is needed when loading the page. This demo has no Node.js or npm build step.
- **Web Serial API** handles the browser's serial-port permission and byte I/O. Use a Chromium-based browser such as Chrome or Edge on `localhost` or another secure context.
- **Arduino C++** provides the optional test responder.

This repository contains a reduced demonstration, not the full telemedicine application. The original application used a different frontend; this demo uses React and Django and does not include the production Vue.js code.

## Django API routes

| Route | Method | Purpose |
|---|---|---|
| `/` | GET | Serve the React application page |
| `/crearUsuario` | POST | Create a user record from JSON |
| `/consultarUsuarios` | GET | Return user records as JSON |
| `/crearDispositivo` | POST | Create a device record from JSON |
| `/consultarDispositivos` | GET | Return device records as JSON |
| `/crearRegistro` | POST | Save a list of received values as a result record |
| `/consultarRegistros` | GET | Return saved result record identifiers |
| `/conseguirDatos/<idRegistro>` | GET | Return the values associated with one result record |

## Run locally

### Requirements

- Python 3.10 or newer
- `pip`
- A browser with Web Serial support for hardware testing
- An Arduino-compatible board only if you want to use the test firmware

### Create an environment and install Django

**macOS / Linux**

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
export DJANGO_DEBUG=True
```

**Windows PowerShell**

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
$env:DJANGO_DEBUG = "True"
```

### Create the local database and start the server

```bash
python manage.py migrate
python manage.py runserver
```

Open <http://127.0.0.1:8000>. The `migrate` command creates a fresh local SQLite database from the checked-in migrations. The existing local `db.sqlite3` is excluded from Git and should not be uploaded.

To test the serial flow, upload the Arduino sketch, connect its USB port from **Results and reports**, then select **Leer**. The nine artificial byte values should appear in the page; select **Guardar** to create a result record.

## Project structure

```text
.
├── WebSerialProject/             # Django settings and project-level URLs
├── appSerial/
│   ├── migrations/               # Database schema history
│   ├── models.py                 # User, device, result, and byte-value models
│   ├── views.py                  # Page and JSON API endpoints
│   ├── urls.py                   # App routes
│   ├── templates/                # Django page templates
│   └── static/components/        # React JSX components
├── arduino/                      # Test firmware and upload notes
├── requirements.txt              # Python dependency
└── manage.py                     # Django command-line entry point
```

## Scope

This repository demonstrates a browser-to-device serial workflow and a small Django API. The project keeps Django's generated development `SECRET_KEY` as a local fallback; it can be overridden with `DJANGO_SECRET_KEY`. Never use the checked-in fallback in a deployed service. The demo endpoints do not implement user authentication or authorization, so run the development server locally only; do not expose it as a public service. It is not a clinical application, must not be used for medical decisions, and does not include the original telemedicine platform's production code or device-decoding logic. No local database or real device data is required to run the demo.
