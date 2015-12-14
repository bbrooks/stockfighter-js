'use strict';

class ApiClient {

  constructor(apiKey){
    
    if(!window.axios) {
      return console.warn('HALTING: axios.js HTTP library not found');
    }

    this.BASE_URL = '/ob/api/';
    this.apiKey = apiKey;

  }

  /**
   * Check whether the API is online
   * @return {Object} response entity
   */
  heartbeat () {
    return this.client({ path: 'heartbeat' })
               .then(res => { return res.data })
  }

  /**
   * Check whether a stock exchange is online
   * @param {Object} opts
   * @param {String} opts.venue - symbol for stock exchange
   * @return {Object} response entity
   */
  venue_heartbeat (opts) {
    return this.client({
      path: `venues/${opts.venue}/heartbeat`
    }).then(res => { return res.data })
  }

  /**
   * Get all stocks in a specific exchange
   * @param {Object} opts
   * @param {String} opts.venue - symbol for stock exchange
   * @return {Object} response entity
   */
  venue_stocks (opts) {
    return this.client({
      path: `venues/${opts.venue}/stocks`
    }).then(res => { return res.data })
  }

  /**
   * Get the orderbook for a specific stock
   * @param {Object} opts
   * @param {String} opts.venue - symbol for stock exchange
   * @param {String} opts.stock - symbol for stock
   * @return {Object} response entity
   */
  orderbook (opts) {
    return this.client({
      path: `venues/${opts.venue}/stocks/${opts.stock}`
    }).then(res => { return res.data })
  }

  /**
   * Buy a stock
   * @param  {Object} opts
   * @param  {String} opts.account - bank account used to purchase
   * @param  {String} opts.venue - symbol for stock exchange
   * @param  {String} opts.stock - symbol for stock to buy
   * @param  {Integer|String} opts.price - Desired price, ex. 50.42 == $50.42
   * @param  {Integer|String} opts.quantity - number of shares to buy
   * @param  {String} opts.type - type of order, can be 'limit', 'market',
   *                              'fill-or-kill', 'immediate-or-cancel'
   * @return {Object} response entity
   */
  buy (opts) {
    let options = {
      account: opts.account,
      direction: 'buy',
      orderType: opts.type,
      qty: opts.quantity
    }

    if (opts.price) {
      options.price = parseInt(opts.price.toString().replace('.', ''), 10)
    }

    return this._order(opts.venue, opts.stock, options)
  }

  /**
   * Sell a stock
   * @param  {Object} opts
   * @param  {String} opts.account - bank account used to purchase
   * @param  {String} opts.venue - symbol for stock exchange
   * @param  {String} opts.stock - symbol for stock to sell
   * @param  {Integer|String} opts.price - Desired price, ex. 50.42 == $50.42
   * @param  {Integer|String} opts.quantity - number of shares to sell
   * @param  {String} opts.type - type of order, can be 'limit', 'market',
   *                              'fill-or-kill', 'immediate-or-cancel'
   * @return {Object} response entity
   */
  sell (opts) {
    let options = {
      account: opts.account,
      direction: 'sell',
      orderType: opts.type,
      qty: opts.quantity
    }

    if (opts.price) {
      options.price = parseInt(opts.price.toString().replace('.', ''), 10)
    }

    return this._order(opts.venue, opts.stock, options)
  }

  /**
   * Order a stock
   * @private
   * @param {String} venue - symbol for stock exchange
   * @param {String} stock - symbol for stock to order
   * @param {Object} options - see buy and sell docs
   * @return {Object} response entity
   */
  _order (venue, stock, opts) {
    return this.client({
      path: `venues/${venue}/stocks/${stock}/orders`,
      method: 'post',
      entity: opts
    }).then(res => { return res.data })
  }

  /**
   * Get a quote for a stock's price
   * @param {String} venue - symbol for stock exchange
   * @param {String} stock - symbol for stock to quote
   * @return {Object} response entity
   */
  quote (opts) {
    return this.client({
      path: `venues/${opts.venue}/stocks/${opts.stock}/quote`
    }).then(res => { return res.data })
  }

  /**
   * Get an order's status
   * @param {Object} opts
   * @param {String} opts.venue - symbol for stock exchange
   * @param {String} opts.stock - symbol for stock
   * @param {String} opts.id - order id
   * @return {Object} response entity
   */
  order_status (opts) {
    return this.client({
      path: `venues/${opts.venue}/stocks/${opts.stock}/orders/${opts.id}`
    }).then(res => { return res.data })
  }

  /**
   * Cancel an order
   * @param {Object} opts
   * @param {String} opts.venue - symbol for stock exchange
   * @param {String} opts.stock - symbol for stock
   * @param {String} opts.id - order id
   * @return {Object} response entity
   */
  cancel_order (opts) {
    return this.client({
      path: `venues/${opts.venue}/stocks/${opts.stock}/orders/${opts.id}`,
      method: 'delete'
    }).then(res => { return res.data })
  }

  /**
   * Get status for all orders
   * @param {Object} opts
   * @param {String} opts.venue - symbol for stock exchange
   * @param {String} opts.account - account number
   * @param {String} opts.stock - symbol for stock
   * @return {Object} response entity
   */
  all_orders (opts) {
    let pathConfig = opts.stock
    ? `venues/${opts.venue}/accounts/${opts.account}/stocks/${opts.stock}/orders`
    : `venues/${opts.venue}/accounts/${opts.account}/orders`

    return this.client({
      path: pathConfig
    }).then(res => { return res.data })
  }

  /**
   * Converts client request to axios request
   * @param {Object} opts - see https://github.com/mzabriskie/axios#request-api
   * @return {Object} promise
   */
  client (opts) {
    opts.headers = {
      'X-Starfighter-Authorization': this.apiKey,
    };
    opts.url = this.BASE_URL+opts.path;
    opts.data = opts.entity;
    opts.method = opts.method || 'GET';

    return axios(opts);
  }

}