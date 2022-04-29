#include <Arduino.h>
#include "Wire.h"
#include "SHT31.h"
#include <DigitalFilters.h>

#define SHT31_ADDRESS   0x44
#define dataSetSize 10

uint32_t start;
uint32_t stop;

SHT31 sht;


DigitalFilters digFilTemp(dataSetSize);
DigitalFilters digFilHum(dataSetSize);
bool flag = false;

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
  if (flag == false)
    {
      for (int i = 0; i < 10; i++)
      {
        digFilHum.AddValue(sht.getHumidity());
        digFilTemp.AddValue(sht.getTemperature());
      }
      flag= true;
    }
  float TempMedia = digFilTemp.AverageFilter();
  float TempExpo = digFilTemp.ExponentialFilter(sht.getTemperature(),0.8);
  float HumMedia = digFilHum.AverageFilter();
  float HumExpo = digFilHum.ExponentialFilter(sht.getHumidity(),0.8);
  String json = "{\"temp\":"+(String)sht.getTemperature()+", \"hum\":"+(String)sht.getHumidity()+", \"AvgTemp\":"+(String)+TempMedia+", \"AvgHum\":"+(String)HumMedia+", \"ExpgHum\":"+(String)HumExpo+", \"ExpTemp\":"+(String)TempExpo+"}";
  Serial.println(json);
  delay(10000);
  }


// -- END OF FILE --

