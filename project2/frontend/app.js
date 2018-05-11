const http = require('http');
const express = require('express')
const app = express()
const path = require('path')

const port = 8080;

app.use(express.static(__dirname))

path.join(__dirname + '/index.html')

app.listen(port, () => {
    console.log('Listen on port: ' + port)
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})