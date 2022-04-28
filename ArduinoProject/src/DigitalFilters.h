#include <Arduino.h>

#define DefaultSizeDataSet 20

class DigitalFilters{

    private:
    // Attributes
		uint8_t sizeDataSet=10;
        void PrintValues(String message);

    public:
	// Attributes
		float dataSet[DefaultSizeDataSet];

    // Methods
		DigitalFilters(uint8_t newSize);
		float AverageFilter(void);
        float ExponentialFilter(float xnValue, float weight);
        void AddValue(float newValue);
};