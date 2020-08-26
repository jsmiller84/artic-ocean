var express = require('express')
var serveStatic = require('serve-static')
var path = require('path')

var app = express()
//crab
//bubble
//game1
const newAddr = "beta_0_1c"

app.get('/', function(req, res) {
  res.redirect('/'+newAddr);
});

app.get('/bubble', function(req, res) {
  res.redirect('/'+newAddr);
});

app.get('/game1', function(req, res) {
  res.redirect('/'+newAddr);
});


app.use('/'+newAddr, serveStatic('.', {
  index: ['index.html'],
  etag: false,
  setHeaders: setCustomCacheControl
}))

function setCustomCacheControl (res, path) {
    res.set('Cache-Control', 'no-store')
}
    
app.listen(9000)
