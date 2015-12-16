# Stockfighter JS

A simple client-side JS client for [stockfighter.io](https://www.stockfighter.io/) ported from [jenius's stockfighter node api wrapper](https://github.com/jenius/stockfighter-node). Props to [jenius](https://github.com/jenius/) for the great work on the code and the documentation!

This project includes a simple node server that will proxy your client-side AJAX calls and allow you to play the game from chrome's browser console.

### Installation

1. Install node
2. Clone or download this repo. 
3. In your terminal, `cd` into the repo folder (wherever `server.js` is)
4. Run `npm install` to install project dependencies
5. Run `node server.js` to start the server
4. Visit [127.0.0.1:8000](http://127.0.0.1:8000) in chrome
5. Open up the console and start firing [commands](#usage) at the stockfighter api!

### Usage

This library exposes a class which you must initialize with an API key in order to use, as such:

```js
var client = new ApiClient(your_api_key);
```

Once you have initialized the client, you can call any of the following methods to get back the API response. All responses are returned as promises, because I like promises and the are a much better way to handle asynchronous control flow than callbacks. If you don't use promises, this is ok, they are very easy to handle and can be treated pretty much the same as callbacks if you decide not to use their extra power. A simple example is given below:

```js
client.heartbeat()
  .then((res) => { console.log(res) })
  .catch((err) => { console.error(err) });
```

### Methods

Any method that takes parameters only accepts an object with the options set as key/value pairs. All methods that take options objects are documented fully along with the option names, types, and descriptions below.

#### client.heartbeat()
Checks if the API is online. ([official docs](https://starfighter.readme.io/docs/heartbeat))

#### client.venue(options)
Checks if a stock exchange is online. ([official docs](https://starfighter.readme.io/docs/venue-healthcheck))

##### Options
- **venue** (String): symbol for stock exchange

#### client.venue_stocks(options)
Returns a list of stocks offered by a stock exchange. ([official docs](https://starfighter.readme.io/docs/list-stocks-on-venue))

##### Options
- **venue** (String): symbol for stock exchange

#### client.orderbook(options)
Gets the order book for a specific stock. ([official docs](https://starfighter.readme.io/docs/get-orderbook-for-stock))

##### Options
- **venue** (String): symbol for stock exchange
- **stock** (String): symbol for the stock

#### client.buy(options)
Purchases a specific stock. ([official docs](https://starfighter.readme.io/docs/place-new-order))

##### Options
- **account** (String): bank account used to purchase
- **venue** (String): symbol for stock exchange
- **stock** (String): symbol for the stock
- **price** (Integer or String) desired price as decimal, ex. 50.42 == $50.42
- **quantity** (Integer or String) number of shares to buy
- **type** (String) type of order, can be 'limit', 'market', 'fill-or-kill', or 'immediate-or-cancel'. See [the docs](https://starfighter.readme.io/docs/place-new-order#order-types) for descriptions of each type.

#### client.sell(options)
Sell a specific stock. ([official docs](https://starfighter.readme.io/docs/place-new-order))

##### Options
- **account** (String): bank account used to purchase
- **venue** (String): symbol for stock exchange
- **stock** (String): symbol for the stock
- **price** (Integer or String) desired price as decimal, ex. 50.42 == $50.42
- **quantity** (Integer or String) number of shares to buy
- **type** (String) type of order, can be 'limit', 'market', 'fill-or-kill', or 'immediate-or-cancel'. See [the docs](https://starfighter.readme.io/docs/place-new-order#order-types) for descriptions of each type.

#### client.quote(opts)
Get the most recent trading information for a stock. ([official docs](https://starfighter.readme.io/docs/a-quote-for-a-stock))

##### Options
- **venue** (String): symbol for stock exchange
- **stock** (String): symbol for the stock

#### client.order_status(opts)
Get the updated status of an existing order. ([official docs](https://starfighter.readme.io/docs/status-for-an-existing-order))

##### Options
- **venue** (String): symbol for stock exchange
- **stock** (String): symbol for the stock
- **id** (Integer): id of the order

#### client.cancel_order(opts)
Cancel an existing order. ([official docs](https://starfighter.readme.io/docs/cancel-an-order))

##### Options
- **venue** (String): symbol for stock exchange
- **stock** (String): symbol for the stock
- **id** (Integer): id of the order

#### client.all_orders(opts)
See all orders in a given account's history ([official docs](https://starfighter.readme.io/docs/status-for-all-orders) and [this too](https://starfighter.readme.io/docs/status-for-all-orders-in-a-stock))

##### Options
- **venue** (String): symbol for stock exchange
- **account** (String): account to view orders for
- **stock** (String): optional - show only orders for this specific stock

#### client.listen_for_quotes(opts)
Get updated when a stock quote is updated ([official docs](https://starfighter.readme.io/docs/quotes-ticker-tape-websocket))

##### Options
- **venue** (String): symbol for stock exchange
- **account** (String): account to view orders for
- **cb** (Function): callback function for when a new quote comes in
- **stock** (String): optional - show only quotes for this specific stock

#### client.listen_for_fills(opts)
Get updated when a fill goes through ([official docs](https://starfighter.readme.io/docs/executions-fills-websocket))

##### Options
- **venue** (String): symbol for stock exchange
- **account** (String): account to view orders for
- **cb** (Function): callback function for when a new fill comes in
- **stock** (String): optional - show only fills for this specific stock

### License and Contributing

This project is licensed under MIT.
