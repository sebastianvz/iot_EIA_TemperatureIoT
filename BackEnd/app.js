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
    fs.createReadStream("/Users/mac/My Drive/Sebastian/Cursos/EAI_IOT/Arquitectura/BackEnd/CSV/teamHum.csv")
    .pipe(parse({delimiter: ':'}))
    .on('data', function(csvrow) {
        csvData.push(csvrow);        
    })
    .on('end',function() {
      //do something with csvData
      console.log(csvData);
      res.send(csvData)
    });
})

app.listen(expressPort, () => {
  console.log(`Example app listening on port ${expressPort}`)
})

// Create a port
const port = new SerialPort({
  path: '/dev/tty.usbmodem143301',
  baudRate: 9600,
})

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
const fields = ['temp', 'hum'];

parser.on('data', function (data) {
    if(new Blob([data]).size >=27)
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


 

  
