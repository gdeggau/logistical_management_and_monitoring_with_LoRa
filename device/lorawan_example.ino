#include <ESP32_LoRaWAN.h>
#include "Arduino.h"
#include <HardwareSerial.h>
#include <TinyGPS++.h>

//SSD1306  Display(0x3c, SDA_OLED, SCL_OLED, RST_OLED);
/*license for Heltec ESP32 LoRaWan, quary your ChipID relevant license: http://resource.heltec.cn/search */
uint32_t  license[4] = {0x00000000,0x00000000,0x00000000,0x00000000};
/* OTAA para*/
uint8_t DevEui[] = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
uint8_t AppEui[] = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
uint8_t AppKey[] = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };

/* ABP para*/
uint8_t NwkSKey[] = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,0x00 };
uint8_t AppSKey[] = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,0x00 };
uint32_t DevAddr =  ( uint32_t )0x00000000;

/*LoraWan channelsmask, default channels 0-7*/ 
uint16_t userChannelsMask[6]={ 0x00FF,0x0000,0x0000,0x0000,0x0000,0x0000 };

/*LoraWan Class, Class A and Class C are supported*/
DeviceClass_t  loraWanClass = CLASS_A;

/*the application data transmission duty cycle.  value in [ms].*/
uint32_t appTxDutyCycle = 300000;

/*OTAA or ABP*/
bool overTheAirActivation = true;

/*ADR enable*/
bool loraWanAdr = true;

/* Indicates if the node is sending confirmed or unconfirmed messages */
bool isTxConfirmed = false;

/* Application port */
uint8_t appPort = 2;

/*!
* Number of trials to transmit the frame, if the LoRaMAC layer did not
* receive an acknowledgment. The MAC performs a datarate adaptation,
* according to the LoRaWAN Specification V1.0.2, chapter 18.4, according
* to the following table:
*
* Transmission nb | Data Rate
* ----------------|-----------
* 1 (first)       | DR
* 2               | DR
* 3               | max(DR-1,0)
* 4               | max(DR-1,0)
* 5               | max(DR-2,0)
* 6               | max(DR-2,0)
* 7               | max(DR-3,0)
* 8               | max(DR-3,0)
*
* Note, that if NbTrials is set to 1 or 2, the MAC will not decrease
* the datarate, in case the LoRaMAC layer did not receive an acknowledgment
*/
uint8_t confirmedNbTrials = 8;

/*LoraWan debug level, select in arduino IDE tools.
* None : print basic info.
* Freq : print Tx and Rx freq, DR info.
* Freq && DIO : print Tx and Rx freq, DR, DIO0 interrupt and DIO1 interrupt info.
* Freq && DIO && PW: print Tx and Rx freq, DR, DIO0 interrupt, DIO1 interrupt, MCU sleep and MCU wake info.
*/
uint8_t debugLevel = LoRaWAN_DEBUG_LEVEL;

/*LoraWan region, select in arduino IDE tools*/
LoRaMacRegion_t loraWanRegion = ACTIVE_REGION;

TinyGPSPlus gps;
HardwareSerial ss(1);

const int RX_PIN = 23;
const int TX_PIN = 22;
const int BAUD_RATE = 9600;

//float latitude = -26.926546;
//float longitude = -48.941608;
//
int32_t lat = 0;
int32_t lon = 0;

static void prepareTxFrame( uint8_t port )
{
    appDataSize = 8;//AppDataSize max value is 64
    appData[0] = (lat >> 24) & 0xFF;
    appData[1] = (lat >> 16) & 0xFF;
    appData[2] = (lat >> 8) & 0xFF;
    appData[3] = lat & 0xFF;
    
    appData[4] = (lon >> 24) & 0xFF;
    appData[5] = (lon >> 16) & 0xFF;
    appData[6] = (lon >> 8) & 0xFF;
    appData[7] = lon & 0xFF;
}

static void setLatitudeLongitude()
{
  Display.clear();
//  bool newData = false; 
  // For one second we parse GPS data and report some key values
  for (unsigned long start = millis(); millis() - start < 5000;) {
    while (ss.available()) {
      if (gps.encode(ss.read())) { // Did a new valid sentence come in? 
        Display.clear();
        if(gps.location.isValid()){
          lat = gps.location.lat() * 100000;
          lon = gps.location.lng() * 100000;
          Serial.print(gps.location.lat(), 6);
          Serial.print(F(","));
          Serial.println(gps.location.lng(), 6);
          Display.drawString(0, 15, "---- COORDINATES ----");
          Display.drawString(0, 30, "Lat:");
          Display.drawString(30, 30, String(gps.location.lat(),6));
          Display.drawString(0, 40, "Lon:");
          Display.drawString(30, 40, String(gps.location.lng(),6));
        }else{
          lat = 0;
          lon = 0;
          Serial.println("Invalid geolocation, please expose GPS antenna to air!");
          Display.drawString(0, 15, "-------- ATENTION --------");
          Display.drawString(0, 35, "Can't get lat/lon, please");
          Display.drawString(0, 45, "expose GPS antenna in air!");
        }
      }
    }
    Display.display();
  }
}

// Add your initialization code here
void setup()
{
  Display.init();
  Display.clear();  
  Display.setFont(ArialMT_Plain_10);
  if(mcuStarted==0)
  {
    Display.drawString(0, 30, "STARTING");
    Display.display();
    delay(1000);
//    LoRaWAN.Display.cuInit();
  }
  Serial.begin(115200);
  ss.begin(BAUD_RATE, SERIAL_8N1, RX_PIN, TX_PIN);
  Serial.println();
  Serial.println("----------- SETUP -----------");
  while (!Serial);
  SPI.begin(SCK,MISO,MOSI,SS);
  Mcu.init(SS,RST_LoRa,DIO0,DIO1,license);
  deviceState = DEVICE_STATE_INIT;
}

// The loop function is called in an endless loop
void loop()
{
//  while (ss.available() > 0)
//    if(gps.encode(ss.read()))
//      setLatitudeLongitude();
//  Serial.println();
//  smartDelay(5000);
  
  switch( deviceState )
  {
    case DEVICE_STATE_INIT:
    {
      Display.clear();
      Serial.println("ANTES INICIAR");
      //Serial.println(deviceState); 
      LoRaWAN.init(loraWanClass,loraWanRegion);
      Serial.println("INICIANDO");
      //Serial.println(deviceState);
      break;
    }
    case DEVICE_STATE_JOIN:
    {
      Display.clear();  
      Display.drawString(0, 30, "JOINING...");
      Display.display();
//      LoRaWAN.Display.oining();
      LoRaWAN.join();
      Serial.println("CONECTANDO A KORE");
      //Serial.println(deviceState);
      break;
    }
    case DEVICE_STATE_SEND:
    {
      Serial.println("ENTROU NO ENVIOU");
      setLatitudeLongitude();
      Serial.println("SETOU LATITUDE E LONGITUDE");
      Display.clear();  
      
      if(lat != 0 && lon != 0) {
//        LoRaWAN.Display.ending();
        Display.drawString(0, 30, "SENDING...");
        Serial.println("ENVIANDO");
        prepareTxFrame( appPort );
        LoRaWAN.send(loraWanClass);
        appTxDutyCycle = 300000;
      }else{
        Display.drawString(0, 30, "TRYING AGAIN IN 60S");
        appTxDutyCycle = 60000;
      }
      Display.display();
      deviceState = DEVICE_STATE_CYCLE;
      Serial.println("SETOU PARA CICLO");
      //Serial.println(deviceState);
      break;
    }
    case DEVICE_STATE_CYCLE:
    {
      Serial.println("ENTROU NO CYCLE");
      //Serial.println(deviceState);
      // Schedule next packet transmission
      txDutyCycleTime = appTxDutyCycle; //+ randr( -APP_TX_DUTYCYCLE_RND, APP_TX_DUTYCYCLE_RND );
      LoRaWAN.cycle(txDutyCycleTime);
      deviceState = DEVICE_STATE_SLEEP;
      Serial.println("SETOU PARA SLEEP");
      //Serial.println(deviceState);
      break;
    }
    case DEVICE_STATE_SLEEP:
    {
      Display.clear();
      //Serial.println("SLEEP");
      Display.drawString(0, 30, "SLEEPING...");
      Display.display();
//      LoRaWAN.Display.ck();
      LoRaWAN.sleep(loraWanClass,debugLevel);
      break;
    }
    default:
    {
      deviceState = DEVICE_STATE_INIT;
      break;
    }
  }
}