const express = require('express')
const app = express()
const stockinfo  = require('stock-info');
const stocks = require('stock-ticker-symbol');
const authtokens = []
var randomstring = require("randomstring");


app.get('/generate', (req, res) => {
  const random = randomstring.generate();

  res.send(`Your api token is ${random}`)

  return authtokens.push(random)
  

})
app.get('/api/:stocksymbol/data', async(req, res) => {
  const symbol = req.params.stocksymbol
  const auth = req.query.auth
  
  if(!auth) {
    res.status(401)
    return res.send(`Please provide a valid authorization token`)
  }
  const iscontained = authtokens.includes(`${auth}`)
  if(!iscontained) {
    res.send(`Invalid authorization token`)
    return res.status(401)
  }
  if(!symbol) {
    return res.send(`PLEASE PROVIDE STOCK SYMBOL YA LOSER`)
  }
  const valid  = stocks.lookup(`${symbol}`); // Apple Inc.;
  if(!valid) {
res.send(`Please provide a valid stock symbol!`)    
  }



  const data =  await stockinfo.getSingleStockInfo(`${symbol}`)

  if(!data) {
    return res.send(`Invalid stock`)
  }

  return res.json(data)

})
app.get('/api', (req, res) =>{

  
})
app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(`
Go to <a href='/generate'>Generate</a> to generate a token
Go to /api/<stocksymbol>/data?auth=<yourgeneratedtoken> to get data on a stock

`);
})
const stockvalid = require('stock-ticker-symbol');

app.get(`/submit`, async(req, res) =>{
  const price1 = req.query.price
  const symbol = req.query.symbol

  if(!price1 || !symbol) {
    return res.send(`Please provide a stock symbol and target price`)
  } 
const valid  = stocks.lookup(`${symbol}`); // Apple Inc.;
  if(!valid) {
return res.send(`Please provide a valid stock symbol!`)    
  }



  const data =  await stockinfo.getSingleStockInfo(`${symbol}`)

  if(!data) {
    return res.send(`Invalid stock`)
  }

  const price = data.regularMarketPrice
  if(price < Number(price1)) {
    return res.send(`${symbol} price is $${price} and is lower than target price`)
  }
  if(price > Number(price1)) {
    return res.send(`${symbol} price is $${price} and is higher than target price`)
  }

  
})

app.listen(80)

