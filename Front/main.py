# %%
from timeit import repeat
import requests
import json
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation


xdata, ydataTemp, ydataTempAVG, ydataTempEXPO, ydataHum, ydataHumAVG, ydataHumEXPO = [],[],[],[],[],[],[]
fig, ax = plt.subplots(2,3)

def update(i):
    response_API = requests.get('http://localhost:3000/')
    data = response_API.text
    parse_json = json.loads(data)
    df = pd.DataFrame(parse_json)
    dflastData = df.iloc[-1]
    print(dflastData)
    xdata.append(i)
    ydataTemp.append(float(dflastData['temp']))
    ydataTempAVG.append(float(dflastData['AvgTemp']))
    ydataTempEXPO.append(float(dflastData['ExpTemp']))
    ydataHum.append(float(dflastData['hum']))
    ydataHumAVG.append(float(dflastData['AvgHum']))
    ydataHumEXPO.append(float(dflastData['ExpgHum']))

    ax[0,0].plot(xdata,ydataTemp,'-o',color='blue')
    ax[0, 0].set_title('Temp')
    ax[0,1].plot(xdata,ydataTempAVG,'-o',color='red')
    ax[0,1].set_title('TempAVG')
    ax[0,2].plot(xdata,ydataTempEXPO,'-o',color='green')
    ax[0, 2].set_title('TempEXPO')
    ax[1,0].plot(xdata,ydataHum,'-o',color='blue')
    ax[1,1].set_title('Hum')
    ax[1,1].plot(xdata,ydataHumAVG,'-o',color='red')
    ax[1,1].set_title('HumAVG')
    ax[1,2].plot(xdata,ydataHumEXPO,'-o',color='green')
    ax[1,2].set_title('HumEXPO')


ani = FuncAnimation(fig, update, repeat=False, interval=10000)
plt.show()
