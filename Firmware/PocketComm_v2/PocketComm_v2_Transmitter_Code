/*
  Project: PocketComm_TX_Final
  Role: Tactical Handheld Unit (Sender)
  Features: Bluetooth Input, OLED HUD, Smart GPS, LoRa Beacon
*/

#include <SPI.h>
#include <LoRa.h>
#include "BluetoothSerial.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <TinyGPS++.h>

// --- HARDWARE PIN MAPPING ---
#define SCK_PIN    18
#define MISO_PIN   19
#define MOSI_PIN   23
#define SS_PIN     5
#define RST_PIN    14
#define DIO0_PIN   26
#define BAND       433E6  // Check your module frequency (433E6, 868E6, 915E6)

#define GPS_RX_PIN 16 
#define GPS_TX_PIN 17 

#define OLED_SDA   21
#define OLED_SCL   22
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

#define DEVICE_ID "ALPHA-01" 

// --- OBJECTS ---
BluetoothSerial SerialBT;
TinyGPSPlus gps;
HardwareSerial SerialGPS(1);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

bool btConnected = false;

void btCallback(esp_spp_cb_event_t event, esp_spp_cb_param_t *param) {
  if (event == ESP_SPP_SRV_OPEN_EVT) btConnected = true;
  else if (event == ESP_SPP_CLOSE_EVT) btConnected = false;
}

void setup() {
  Serial.begin(115200);
  
  // 1. Init OLED
  Wire.begin(OLED_SDA, OLED_SCL);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("[ERR] OLED Failed")); while(1);
  }
  display.setTextColor(WHITE);
  display.setTextWrap(false);
  
  // 2. Init GPS
  SerialGPS.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);

  // 3. Init Bluetooth
  SerialBT.register_callback(btCallback);
  SerialBT.begin("PocketComm_Sender"); 
  
  // 4. Init LoRa
  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);
  LoRa.setPins(SS_PIN, RST_PIN, DIO0_PIN);
  if (!LoRa.begin(BAND)) {
    display.clearDisplay(); display.setCursor(0,0); display.print("RADIO FAIL"); display.display();
    while (1);
  }
  LoRa.setSyncWord(0xF3); // Security Key
  
  drawHUD("STANDBY", "Waiting for App...");
}

void loop() {
  // Feed GPS Data
  while (SerialGPS.available() > 0) gps.encode(SerialGPS.read());

  // Check Bluetooth Message
  if (SerialBT.available()) {
    String msg = SerialBT.readString();
    msg.trim();
    if (msg.length() > 0) transmitPacket(msg);
  }
  
  // Idle Refresh
  if(millis() % 2000 == 0) drawHUD(btConnected ? "ARMED" : "STANDBY", btConnected ? "Ready to Send" : "Connect Phone");
}

void transmitPacket(String text) {
  // 1. Capture Location
  String loc = "No GPS Lock";
  if (gps.location.isValid()) {
    loc = String(gps.location.lat(), 6) + "," + String(gps.location.lng(), 6);
  }

  // 2. Build Payload: ID|MSG|LOC|BAT
  String packet = String(DEVICE_ID) + "|" + text + "|" + loc + "|98";

  // 3. Send via LoRa
  drawHUD("TX ACTIVE", "Transmitting...");
  LoRa.beginPacket();
  LoRa.print(packet);
  LoRa.endPacket();
  
  SerialBT.println("Packet Sent: " + text);
  
  // 4. Scrolling Confirmation (The "Maverick" Effect)
  scrollMessage("MSG SENT", text);
}

// --- HUD ENGINE ---
void drawHUD(String status, String subtext) {
  display.clearDisplay();
  
  // Top Bar
  display.setTextSize(1);
  display.setCursor(0,0); display.print(btConnected ? "BT:ON" : "BT:--");
  display.setCursor(50,0); display.print("SAT:"); display.print(gps.satellites.value());
  display.setCursor(100,0); display.print("98%");
  display.drawLine(0, 10, 128, 10, WHITE);

  // Main Status
  display.setTextSize(2);
  int16_t x1, y1; uint16_t w, h;
  display.getTextBounds(status, 0, 0, &x1, &y1, &w, &h);
  display.setCursor((128-w)/2, 25);
  display.print(status);

  // Subtext
  display.setTextSize(1);
  display.setCursor(0, 55);
  display.print(subtext);
  
  display.display();
}

void scrollMessage(String header, String text) {
  int x = 128;
  int minX = -12 * text.length();
  unsigned long start = millis();
  
  while(millis() - start < 5000) { // Scroll for 5 seconds
    display.clearDisplay();
    display.setTextSize(2);
    display.setCursor(0,0); display.print(header);
    display.drawLine(0, 18, 128, 18, WHITE);
    
    display.setTextSize(2);
    display.setCursor(x, 30);
    display.print(text);
    
    x -= 6; // Scroll Speed
    if(x < minX) x = 128;
    
    display.display();
  }
}
