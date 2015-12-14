'use strict';

class ApiClient {

  constructor(apiKey){
    this.apiKey = apiKey;
  }

  _request(url, type, data, cb){
    var req = new XMLHttpRequest();
    req.responseType = "json";

    if(cb) {
      var decoratedCb = this._responseCbBuilder(cb)
      req.addEventListener('load', decoratedCb);
    }

    req.open(type, url);
    req.setRequestHeader('X-Starfighter-Authorization', this.apiKey);

    if( type === "POST") {
      req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    }

    req.send(JSON.stringify(data));
  }
  
  get(url, cb) {
    this._request(url, 'GET', null, cb);
  }
  
  post(url, data, cb){
    this._request(url, 'POST', data, cb);
  }
  
  delete(url, cb){
    this._request(url, 'DELETE', null, cb);
  }

  _responseCbBuilder(cb) {
    return function(e){
      cb(e.target.response);
    }
  }
}