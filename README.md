# Augmented physical visualization of home food consumption and nutrition

This Project runs Socket IO client sides on two ESP32 boards and server side on index.js.

This project uses:
1. Three ESP32 boards. 
2. Four load cells and four HX711 amplifiers to food measure weight.
3. Four linear servos (SG90) to represent the food weight data. The 3D model files from https://github.com/tscha70/3DPrinterSTLFiles/tree/master/win-D/STL-Parts with minor modifications.
4. Four touch sensors to select food to show detailed AR information. (using AR.js) 
5. Four distance sensors (VL6180) to let users to interact with the weight data and see the nutrition changes

