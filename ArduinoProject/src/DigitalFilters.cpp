#include "DigitalFilters.h"

DigitalFilters::DigitalFilters(uint8_t newSize){
	sizeDataSet = newSize;
	dataSet[sizeDataSet];
}

float DigitalFilters::AverageFilter(void){
    float averageValue = 0;
    for(uint8_t i = 0; i < sizeDataSet; ++i)
    {
        averageValue += dataSet[i];
    }
    averageValue /= sizeDataSet;
    return averageValue;
}

float DigitalFilters::ExponentialFilter(float xnValue, float weight){
    float ynValue = weight*xnValue + (1 - weight)*dataSet[0];
    dataSet[0] = ynValue;
    return ynValue;
}

void DigitalFilters::AddValue(float newValue) {
	memcpy((void*) &dataSet, (void*) &dataSet[1], sizeof(float) * (-1 + sizeDataSet));
	dataSet[-1 + sizeDataSet] = newValue;
}
	//PrintValues("The dataset values are");

void DigitalFilters::PrintValues(String message){
	Serial.print(message);
	Serial.print(": [");
	for (uint8_t i = 0; i < sizeDataSet; i++) {
		Serial.print(dataSet[i]);
		Serial.print(", ");
	}
	Serial.println("]");
}
