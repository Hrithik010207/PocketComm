/*
  Project: PocketComm_RX_Final
  Role: Command Station Gateway (Receiver)
  Features: Professional Serial Log, Firebase Upload, Auto-Reconnect
*/

#include <SPI.h>
#include <LoRa.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// --- CONFIGURATION ---
#define BAND        433E6 
#define WIFI_SSID   "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD."
#define API_KEY     "YOUR_API_KEY"
#define DATABASE_URL "YOUR_DATABASE_URL"

// --- PINS ---
#define SCK_PIN    18
#define MISO_PIN   19
#define MOSI_PIN   23
#define SS_PIN     5
#define RST_PIN    14
#define DIO0_PIN   26

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
bool wifiConnected = false;

void setup() {
  Serial.begin(115200);
  Serial.println("\n\n=== POCKETCOMM BASE STATION ONLINE ===");

  // 1. Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("[NET] Connecting to Uplink");
  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(500); Serial.print("."); retry++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[NET] Uplink Secured. IP: " + WiFi.localIP().toString());
    wifiConnected = true;
    
    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;
    config.signer.test_mode = true;
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
  } else {
    Serial.println("\n[NET] Connection Failed. Engaging OFFLINE MONITOR MODE.");
  }

  // 2. LoRa
  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);
  LoRa.setPins(SS_PIN, RST_PIN, DIO0_PIN);
  if (!LoRa.begin(BAND)) {
    Serial.println("[ERR] LoRa Module Critical Failure!"); while (1);
  }
  LoRa.setSyncWord(0xF3);
  Serial.println("[RAD] Radio Listening on 433MHz (Sync: 0xF3)");
  Serial.println("=== WAITING FOR PACKETS ===\n");
}

void loop() {
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    // 1. Read Packet
    String incoming = "";
    while (LoRa.available()) incoming += (char)LoRa.read();
    
    // 2. Parse Data (Pipe Delimited)
    String devID = parseVal(incoming, 0);
    String msg   = parseVal(incoming, 1);
    String loc   = parseVal(incoming, 2);
    String bat   = parseVal(incoming, 3);
    
    // 3. Print Professional Log
    printLog(devID, msg, loc, bat, LoRa.packetRssi(), LoRa.packetSnr());
    
    // 4. Cloud Upload
    if (wifiConnected && Firebase.ready()) {
      Serial.print("[CLOUD] Syncing...");
      String path = "/alerts/" + String(millis());
      Firebase.RTDB.setString(&fbdo, path + "/id", devID);
      Firebase.RTDB.setString(&fbdo, path + "/msg", msg);
      Firebase.RTDB.setString(&fbdo, path + "/loc", loc);
      Firebase.RTDB.setInt(&fbdo, path + "/rssi", LoRa.packetRssi());
      Serial.println(" DONE.");
    }
  }
}

void printLog(String id, String msg, String loc, String bat, int rssi, float snr) {
  Serial.println("┌──────────────────────────────────────────────────┐");
  Serial.print  ("│ INCOMING PACKET DETECTED | T+"); Serial.print(millis()); Serial.println("ms");
  Serial.println("├──────────────────────────────────────────────────┤");
  Serial.print  ("│ [SIGNAL] RSSI: "); Serial.print(rssi); Serial.print(" dBm  | SNR: "); Serial.println(snr);
  Serial.print  ("│ [SOURCE] ID  : "); Serial.println(id);
  Serial.print  ("│ [STATUS] BAT : "); Serial.print(bat); Serial.println("%");
  Serial.println("├──────────────────────────────────────────────────┤");
  Serial.print  ("│ [PAYLOAD] "); Serial.println(msg);
  Serial.print  ("│ [GEO-LOC] "); Serial.println(loc);
  Serial.println("└──────────────────────────────────────────────────┘");
  Serial.println("");
}

String parseVal(String data, int index) {
  int found = 0; int strIndex[] = {0, -1}; int maxIndex = data.length()-1;
  for(int i=0; i<=maxIndex && found<=index; i++){
    if(data.charAt(i)=='|' || i==maxIndex){
        found++; strIndex[0] = strIndex[1]+1;
        strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
  }
  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";
}
