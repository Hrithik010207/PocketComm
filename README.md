# PocketComm
# ⚡ PocketComm

**'Unbreakable Connection When Grids Fail**

PocketComm is a **tactical, infrastructure-independent communication ecosystem** engineered for *last‑mile connectivity* during catastrophic network failures. By orchestrating a hybrid architecture of **Bluetooth, LoRa (Long Range RF), and cloud intelligence**, PocketComm transforms a simple smartphone into a **reliable emergency communication node** when cellular networks collapse.

This project is built with a strong focus on **real-world deployment**, system resilience, and clarity of operation, rather than theoretical performance claims.

---

## 🚀 Mission: Beyond the Last Mile

In a geographically diverse country like India, cellular networks are often the first casualty during floods, cyclones, earthquakes, and landslides. Once towers fail, communication drops to zero.

PocketComm addresses this "Zero Communication" crisis by delivering:

* **Disaster‑Proof Messaging**
  Free‑text emergency communication across kilometers without relying on SIM cards, mobile data, or telecom towers.

* **Guaranteed Reliability**
  A custom acknowledgement‑based protocol ensures that every distress signal is received, logged, and not silently lost.

* **AI‑Prioritized Rescue**
  Integration with **Google Gemini AI** to automatically classify and rank incoming alerts based on medical and situational urgency.

---

## 🛠️ System Architecture

PocketComm utilizes a **Hybrid Edge–Cloud Topology**, ensuring communication continues locally while critical data survives the air‑gap once internet connectivity is restored at the base station.

### Communication Flow

```
Smartphone
   ↓ (Bluetooth)
ESP32 Sender Node
   ↓ (LoRa RF)
ESP32 Base Station
   ↓ (Wi‑Fi)
Cloud Dashboard + AI Processing
```

---

## 📦 Hardware Manifest (BOM)

| Component | Specification         | Role                                                         |
| --------- | --------------------- | ------------------------------------------------------------ |
| MCU       | ESP32                 | Dual‑core processing (240 MHz) for multitasking              |
| Radio     | SX1278 LoRa (433 MHz) | Long‑range RF communication using spread‑spectrum modulation |
| GPS       | NEO‑6M                | Real‑time geolocation tagging for emergency packets          |
| Display   | 0.96" SSD1306 OLED    | Heads‑up display for live system status                      |

---

## 💻 Software Stack

### Embedded Layer

* **Language:** C++
* **Framework:** Arduino IDE
* Firmware for handheld sender and base station receiver

### Communication Layer

* **Serial Bluetooth Terminal** (Smartphone ↔ ESP32)
* **LoRa RF** (Node ↔ Node)

### Cloud & Backend

* **Firebase Realtime Database** for near real‑time message synchronization

### Intelligence Layer

* **Google Gemini API** for alert classification and priority scoring

### Interface

* **Tactical Web Dashboard** built using HTML, CSS, and JavaScript

---

## ⚙️ Core Innovations

* **Smart‑Lock Telemetry**
  Every outgoing message is automatically stamped with real‑time GPS coordinates at the sender node.

* **Dynamic Information Display**
  Custom firmware manages live system indicators on the OLED display.

* **No‑App Interface**
  Users interact via standard Bluetooth terminal apps, eliminating dependency on proprietary software during emergencies.

* **Infrastructure Independence**
  Fully operational without cellular networks or internet access on the sender side.

---

## ⚡ Quick Start (Prototype Setup)

1. Install **Arduino IDE** (v2.x recommended)
2. Add **ESP32 board support** via the Boards Manager
3. Install required libraries:

   * LoRa
   * TinyGPS++
   * Adafruit SSD1306
   * Adafruit GFX
4. Flash `sender/sender.ino` to the handheld ESP32
5. Flash `receiver/receiver.ino` to the base station ESP32
6. Pair the smartphone with ESP32 using ** Serial Bluetooth Terminal**
7. Use a Application to send and receive messages without any network

---

## 📁 Repository Structure

```
PocketComm/
├── sender/
│   └── sender.ino
├── receiver/
│   └── receiver.ino
├── dashboard/
│   └── index.html
├── docs/
│   └── architecture.png
└── README.md
```

---

## 📊 Sample Outputs

### 1. Base Station (Receiver) Serial Monitor

```
=== POCKETCOMM BASE STATION ONLINE ===
[NET] Uplink Secured. IP: 192.168.1.104
[RAD] Radio Listening on 433MHz (Sync: 0xF3)

┌──────────────────────────────────────────────────┐
│ INCOMING PACKET DETECTED | T+45200ms             
├──────────────────────────────────────────────────┤
│ [SIGNAL] RSSI: -48 dBm  | SNR: 9.25              
│ [SOURCE] ID  : ALPHA-01                          
│ [STATUS] BAT : 98%                               
├──────────────────────────────────────────────────┤
│ [PAYLOAD] Medical Emergency, Send Help!          
│ [GEO-LOC] 12.9716, 77.5946                       
└──────────────────────────────────────────────────┘
[CLOUD] Syncing to Command Center... DONE.
```

### 2. Handheld (Sender) OLED HUD

```
-------------------
BT:ON    SAT:08   98%    <-- System Health Bar
-------------------

      ARMED              <-- System Status

   Ready to Send         <-- Operation Mode
```


## 👥 Team PowerHouse

* **S. Sowravkanth**
* **Y. Hrithik**
* **Tejeshwar A. S**
* **Tharun Raj A. M**
* **Muthukumaran T**
* **Hemanth A. R**

---


## 📄 License

This project is open‑source and released under the **MIT License**.

---

##  PocketComm

**Communication Without Boundaries.**
