require("babel/register");

var express = require('express');
var app = module.exports = express();
var React = require('react');
var ourApp = require('./src/js/components/App.jsx');

app.set('views', __dirname + '/dist')
app.set('view engine', 'jade')
app.use(express.static(__dirname + '/dist'))

app.get('/', function (req, res) {
  res.render( 'main', { ourApp: React.renderToString(React.createElement(ourApp)) });
})

app.listen(3000);
console.log('Server running on 3000');
