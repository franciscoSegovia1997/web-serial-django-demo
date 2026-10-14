# Arduino test firmware

This sketch provides a deterministic serial device for testing the Django app's Web Serial flow. It is intended for an Arduino Uno, Nano, or a compatible board connected through its USB serial port.

## Protocol used by the app

- Baud rate: **9600**
- Request byte sent by the app: **`0x41` (`A`)**
- Test response: **nine raw bytes** — `10, 20, 30, 40, 50, 60, 70, 80, 90`
- The response has no text, delimiter, checksum, or sensor conversion.

The app currently stores each received byte as a decimal value. This sketch only emulates that input; it does not represent a real sensor protocol.

## Use

1. Open `firmware_prueba/firmware_prueba.ino` in the Arduino IDE.
2. Select the connected Arduino board and its USB serial port, then upload the sketch.
3. Run the Django application on `localhost` and open it in a browser that supports Web Serial, such as Chrome or Edge.
4. In **Resultados y reportes**, choose the Arduino port with **Conectar**, then press **Leer**. The received bytes should appear in the data field.
