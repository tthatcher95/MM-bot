"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHistoricalDataCoinbase = fetchHistoricalDataCoinbase;
exports.fetchHistoricalDataKraken = fetchHistoricalDataKraken;
exports.fetchHistoricalDataBitfinex = fetchHistoricalDataBitfinex;
exports.startSimulatedFeed = startSimulatedFeed;
exports.startPriceFeed = startPriceFeed;
exports.getLatestWeightedAggregatedPrice = getLatestWeightedAggregatedPrice;
const axios_1 = __importDefault(require("axios"));
const ws_1 = __importDefault(require("ws"));
const coinbaseSymbol = ['BTC-USD'];
const krakenSymbol = ['XBT/USD'];
const bitfinSymbol = 'BTCUSD';
// If using hisorical data, fill these in
const fromSpecificDate = new Date('2023-01-01T00:00:00Z');
const fromTimestampInMilliseconds = fromSpecificDate.getTime();
const toSpecificDate = new Date('2023-02-01T00:00:00Z');
const toTimestampInMilliseconds = toSpecificDate.getTime();
// Fetch and simulate historical data from Coinbase
function fetchHistoricalDataCoinbase() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get('https://api.exchange.coinbase.com/products/BTC-USD/candles', {
            params: {
                granularity: 3600,
                start: fromSpecificDate,
                end: toSpecificDate,
            },
        });
        const candles = response.data;
        for (const candle of candles) {
            const price = candle[4]; // Close price
            prices['coinbase'] = { price, weight: 1.0 };
            console.log(`[Coinbase] Simulated Price: ${price}, Aggregated: ${getWeightedAggregatedPrice()}`);
            yield new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay between updates
        }
    });
}
// Additional functions for Kraken, Bitfinex, etc.
function fetchHistoricalDataKraken() {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: This API endpoint downloads data
        const response = yield axios_1.default.get('https://api.kraken.com/0/public/OHLC', {
            params: {
                pair: 'XBTUSD',
                interval: 1,
                since: fromTimestampInMilliseconds,
            },
        });
        const candles = response.data.result.XXBTZUSD;
        for (const candle of candles) {
            const price = candle[4]; // Close price
            prices['kraken'] = { price, weight: 0.8 };
            console.log(`[Kraken] Simulated Price: ${price}, Aggregated: ${getWeightedAggregatedPrice()}`);
            yield new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay between updates
        }
    });
}
function fetchHistoricalDataBitfinex() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get('https://api-pub.bitfinex.com/v2/candles/trade:1m:tBTCUSD/hist', {
            params: {
                start: fromTimestampInMilliseconds,
                end: toTimestampInMilliseconds,
                limit: 1000,
            },
        });
        const candles = response.data;
        for (const candle of candles) {
            const price = candle[2]; // Close price
            prices['bitfinex'] = { price, weight: 0.5 };
            console.log(`[Bitfinex] Simulated Price: ${price}, Aggregated: ${getWeightedAggregatedPrice()}`);
            yield new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay between updates
        }
    });
}
// Main function to simulate data
function startSimulatedFeed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetchHistoricalDataCoinbase();
        yield fetchHistoricalDataKraken();
        yield fetchHistoricalDataBitfinex();
    });
}
// ---- API REQUESTS CALLS ----
// import axios from 'axios';
// // Define interfaces for price data response
// interface PriceResponse {
//   exchange: string;
//   price: number;
//   weight: number;
// }
// // Function to fetch price from Binance
// async function fetchPriceFromBinance(): Promise<PriceResponse> {
//   try {
//     const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
//     const price = parseFloat(response.data.price);
//     return { exchange: 'Binance', price, weight: 1 }; // Assign a weight (1 in this case)
//   } catch (error) {
//     console.error('Error fetching price from Binance:');
//     return { exchange: 'Binance', price: 0, weight: 0 }; // Return 0 if there's an error
//   }
// }
// // Function to fetch price from Coinbase
// async function fetchPriceFromCoinbase(): Promise<PriceResponse> {
//   try {
//     const response = await axios.get('https://api.coinbase.com/v2/prices/BTC-USD/spot');
//     const price = parseFloat(response.data.data.amount);
//     return { exchange: 'Coinbase', price, weight: 1 };
//   } catch (error) {
//     console.error('Error fetching price from Coinbase:');
//     return { exchange: 'Coinbase', price: 0, weight: 0 };
//   }
// }
// // Function to fetch price from Kraken
// async function fetchPriceFromKraken(): Promise<PriceResponse> {
//   try {
//     const response = await axios.get('https://api.kraken.com/0/public/Ticker?pair=XBTUSD');
//     const price = parseFloat(response.data.result.XXBTZUSD.c[0]);
//     return { exchange: 'Kraken', price, weight: 1 };
//   } catch (error) {
//     console.error('Error fetching price from Kraken:');
//     return { exchange: 'Kraken', price: 0, weight: 0 };
//   }
// }
// // Aggregate prices from multiple exchanges
// export async function getAggregatedPrice(): Promise<number> {
//   const prices = await Promise.all([
//     fetchPriceFromBinance(),
//     fetchPriceFromCoinbase(),
//     fetchPriceFromKraken(),
//   ]);
// ``
//   const validPrices = prices.filter(p => p.weight > 0);
//   if (validPrices.length === 0) {
//     throw new Error('No valid prices found from exchanges');
//   }
//   const weightedSum = validPrices.reduce((sum, p) => sum + p.price * p.weight, 0);
//   const totalWeight = validPrices.reduce((sum, p) => sum + p.weight, 0);
//   return weightedSum / totalWeight;
// }
const prices = {};
// Function to calculate the weighted average price
function getWeightedAggregatedPrice() {
    const priceValues = Object.values(prices);
    if (priceValues.length === 0)
        return 0; // Return 0 if no prices are available
    // Calculate weighted sum and total weight
    const weightedSum = priceValues.reduce((sum, data) => sum + (data.price * data.weight), 0);
    const totalWeight = priceValues.reduce((sum, data) => sum + data.weight, 0);
    return weightedSum / totalWeight;
}
// ----- NONWEIGHTED AVG PRICE -----
// // A map to store real-time prices from each exchange
// const prices: { [exchange: string]: number } = {};
// // Function to calculate the aggregated price (simple average)
// function getAggregatedPrice(): number {
//   const priceValues = Object.values(prices);
//   if (priceValues.length === 0) return 0; // Return 0 if no prices are available
//   const sum = priceValues.reduce((a, b) => a + b, 0);
//   return sum / priceValues.length;
// }
// ---- WEBSOCKET CONNECTIONS ----
// WebSocket connection to Coinbase with subscription
function connectCoinbase() {
    const coinbaseWS = new ws_1.default('wss://ws-feed.exchange.coinbase.com');
    // Subscribe to the ticker channel for BTC-USD when the connection opens
    coinbaseWS.on('open', () => {
        const subscribeMessage = {
            type: 'subscribe',
            product_ids: coinbaseSymbol, // Define the product to subscribe to (e.g., BTC-USD, defined above)
            channels: ['ticker'],
        };
        coinbaseWS.send(JSON.stringify(subscribeMessage));
        console.log('Subscribed to Coinbase ticker for BTC-USD');
    });
    // Handle incoming messages
    coinbaseWS.on('message', (data) => {
        const parsed = JSON.parse(data);
        // Only process ticker messages with a price
        if (parsed.type === 'ticker' && parsed.price) {
            const price = parseFloat(parsed.price);
            prices['coinbase'] = { price, weight: 1.0 };
            // console.log(`Coinbase Price: ${price}`);
            // console.log(`Aggregated Price: ${getAggregatedPrice()}`);
        }
    });
    // Handle errors
    coinbaseWS.on('error', (error) => console.error('Coinbase WebSocket Error:', error));
}
// WebSocket connection to Kraken
function connectKraken() {
    const krakenWS = new ws_1.default('wss://ws.kraken.com');
    krakenWS.on('open', () => {
        krakenWS.send(JSON.stringify({
            event: 'subscribe',
            pair: krakenSymbol,
            subscription: { name: 'ticker' }
        }));
    });
    krakenWS.on('message', (data) => {
        const parsed = JSON.parse(data);
        if (parsed[1] && parsed[1].c) { // 'c' is the price in Kraken stream
            const price = parseFloat(parsed[1].c[0]);
            prices['kraken'] = { price, weight: 0.8 };
            // console.log(`Kraken Price: ${price}`);
            // console.log(`Aggregated Price: ${getAggregatedPrice()}`);
        }
    });
    krakenWS.on('error', (error) => console.error('Kraken WebSocket Error:', error));
}
// WebSocket connection to Bitfinex
function connectBitfinex() {
    const bitfinexWS = new ws_1.default('wss://api-pub.bitfinex.com/ws/2');
    bitfinexWS.on('open', () => {
        bitfinexWS.send(JSON.stringify({
            event: 'subscribe',
            channel: 'ticker',
            pair: bitfinSymbol,
        }));
    });
    bitfinexWS.on('message', (data) => {
        const parsed = JSON.parse(data);
        if (parsed[1] && typeof parsed[1][6] === 'number') { // index 6 in Bitfinex ticker data
            const price = parsed[1][6];
            prices['bitfinex'] = { price, weight: 0.5 };
            // console.log(`Bitfinex Price: ${price}`);
            // console.log(`Aggregated Price: ${getAggregatedPrice()}`);
        }
    });
    bitfinexWS.on('error', (error) => console.error('Bitfinex WebSocket Error:', error));
}
// Start listening to all WebSocket streams
function startPriceFeed() {
    connectCoinbase();
    connectKraken();
    connectBitfinex();
    // TODO: Fix Binance / Bybit
    // connectBinance();
    // connectBybit();
}
// // Export function to get the latest aggregated price (non-weighted)
// export function getLatestAggregatedPrice(): number {
//   return getAggregatedPrice();
// }
function getLatestWeightedAggregatedPrice() {
    return getWeightedAggregatedPrice();
}
//# sourceMappingURL=price-feed.js.map