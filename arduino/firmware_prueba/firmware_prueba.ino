const uint8_t REQUEST_COMMAND = 0x41;
const uint8_t TEST_PAYLOAD[] = {10, 20, 30, 40, 50, 60, 70, 80, 90};

void setup() {
  Serial.begin(9600);
}

void loop() {
  while (Serial.available() > 0) {
    const int command = Serial.read();

    if (command == REQUEST_COMMAND) {
      Serial.write(TEST_PAYLOAD, sizeof(TEST_PAYLOAD));
      Serial.flush();
    }
  }
}
