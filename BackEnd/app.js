const express = require('express')

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const {Blob} = require('node:buffer')
const json2csv = require('json2csv').parse;
const fs = require('fs');
const path = require('path');
var parse = require('csv-parser');

const app = express()
const expressPort = 3000

app.get('/', (req, res) => {
    var csvData=[];
    let windows = "C:\\Users\\SebastianVelez\\Documents\\EIAIoTArquitecturaMicro\\TemperatureIoT\\BackEnd\\CSV\\teamHum.csv";
    let macOs= "/Users/mac/My Drive/Sebastian/Cursos/EAI_IOT/Arquitectura/TemperaturaHumedad/BackEnd/CSV/teamHum.csv"
    fs.createReadStream(macOs)
    .pipe(parse({delimiter: ':'}))
    .on('data', function(csvrow) {
        csvData.push(csvrow);        
    })
    .on('end',function() {
      //do something with csvData
      console.log(csvData);
      console.log(JSON.stringify(csvData));
      res.send(JSON.stringify(csvData))
    });
})

app.listen(expressPort, () => {
  console.log(`Example app listening on port ${expressPort}`)
})

// Create a port
const port = new SerialPort({
  path: '/dev/cu.usbmodem143301',
  //path: 'COM3',
  baudRate: 9600,
})

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
const fields = ['temp', 'hum', 'AvgTemp', 'AvgHum', 'ExpgHum', 'ExpTemp'];

parser.on('data', function (data) {
    if(new Blob([data]).size > 27)
    {
        let jsonData = JSON.parse(data)
        console.log(jsonData)
        write('teamHum.csv', fields, jsonData);
    }
  })

  const write = async (fileName, fields, data) => {
    // output file in the same folder
    const filename = path.join(__dirname, 'CSV', `${fileName}`);
    let rows;
    // If file doesn't exist, we will create new file and add rows with headers.    
    if (!fs.existsSync(filename)) {
        rows = json2csv(data, { header: true });
    } else {
        // Rows without headers.
        rows = json2csv(data, { header: false });
    }
    // Append file function can create new file too.
    fs.appendFile(filename, rows, function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file! one the new file');
      });
    // Always add new line if file already exists.
        fs.appendFile(filename, "\r\n", function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
      });
}


 

  
