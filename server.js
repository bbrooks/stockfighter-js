'use strict';

var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var bl = require('bl');
var apiUrlPrefix = '/ob/api';

var server = http.createServer(function(req, res){
  var isApiCall = req.url.indexOf(apiUrlPrefix) === 0;
  if(isApiCall) {
    handleStockfighterApiReq(req, res);
  } else {
    handleFileReq(req, res);
  }
});

function handleStockfighterApiReq(req, res) {
  console.log('Forwarding API Request to ' + req.url);
  if(req.method === "POST") {
    req.pipe(bl(function(err, data){
      forwardReqest2Stockfighter(req, res, data)
    }));
  } else {
    forwardReqest2Stockfighter(req, res); 
  }
}

function forwardReqest2Stockfighter(req, res, postData) {

  delete req.headers.host;

  var options = {
    hostname: 'api.stockfighter.io',
    port: 443,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  var apiReq = https.request(options, function(apiRes) {
    apiRes.pipe(bl(function(err, apiRespData){
      res.end(apiRespData);
    }));
  });

  if(postData) {
    apiReq.write(postData);
  }

  apiReq.end();

  apiReq.on('error', function(e) {
    console.error('ERRRRRRROR');
    console.error(e);
    res.end()
  }); 
}

function handleFileReq(req, res) {

  var filePath = '.' + req.url;

  if(filePath === './') {
    filePath = './index.html';
  }

  var extName = path.extname(filePath);
  var contentType = 'text/plain';

  if(extName === '.js') {
    contentType = 'application/javascript';
  } else if( extName === '.html' ){
    contentType = 'text/html';
  }

  fs.readFile(filePath, function(error, content) {
    if (error) {
      if(error.code === 'ENOENT') {
        res.writeHead(404);
      } else {
        res.writeHead(500);
      }
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

console.log('Stockfighter Proxy Server Running on Port 8000');
server.listen(8000);