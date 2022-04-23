#include <Arduino.h>
#include "Wire.h"
#include "SHT31.h"

#define SHT31_ADDRESS   0x44

uint32_t start;
uint32_t stop;

SHT31 sht;


void setup()
{
  Serial.begin(9600);
  Serial.println(__FILE__);
  Serial.print("SHT31_LIB_VERSION: \t");
  Serial.println(SHT31_LIB_VERSION);

  Wire.begin();
  sht.begin(SHT31_ADDRESS);
  Wire.setClock(100000);

  uint16_t stat = sht.readStatus();
  Serial.print(stat, HEX);
  Serial.println();
}


void loop()
{
  start = micros();
  sht.read();         // default = true/fast       slow = false
  stop = micros();
  String json = "{\"temp\":"+(String)sht.getTemperature()+", \"hum\":"+(String)sht.getHumidity()+"}";
  Serial.println(json);
  delay(3000);
  }


// -- END OF FILE --

