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
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketMakingBot = marketMakingBot;
const price_feed_1 = require("@market-making-bot/price-feed");
// import { placeBuyOrder, placeSellOrder, cancelOrder, getOrderStatus } from './exchange-api'; // Assume exchange API integration
// Define parameters
const spread = 0.01;
const orderSize = 0.001;
let buyOrderId = null;
let sellOrderId = null;
// Used to calculate profit
let histData = false;
let lastBuy = 0;
let lastSell = 0;
let lastProfit = 0;
let totalProfit = 0;
// Starts the price feed for websockets
if (histData) {
    (0, price_feed_1.startSimulatedFeed)();
}
else {
    (0, price_feed_1.startPriceFeed)();
}
// Function to calculate the buy and sell prices based on the spread
function calculateOrderPrices(marketPrice) {
    const buyPrice = marketPrice * (1 - spread);
    const sellPrice = marketPrice * (1 + spread);
    return { buyPrice, sellPrice };
}
// Mock data for orders being filled
// TODO: Implement API calls for orders once accts are setup
function getRandomOrderStatus() {
    return Math.random() < 0.5 ? "FILLED" : "NOT";
}
function marketMakingBot() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            while (true) {
                // Step 1: Start price feed from web socks for the current market price from external exchanges      
                const marketPrice = (0, price_feed_1.getLatestWeightedAggregatedPrice)();
                console.log(`[BOT] Current market price: ${marketPrice}`);
                // Step 2: Calculate buy and sell prices based on the market price
                const { buyPrice, sellPrice } = calculateOrderPrices(marketPrice);
                console.log(`[BOT] Placing buy order at: ${buyPrice}, sell order at: ${sellPrice}`);
                // Step 3: Place the buy and sell orders if they are not already placed
                if (!buyOrderId) {
                    // TODO: Implment API call
                    // buyOrderId = await placeBuyOrder(buyPrice, orderSize);
                    buyOrderId = "0009";
                }
                if (!sellOrderId) {
                    // TODO: Implment API call
                    // sellOrderId = await placeSellOrder(sellPrice, orderSize);
                    sellOrderId = "0001";
                }
                // Step 4: Monitor the status of the buy and sell orders
                const buyOrderStatus = getRandomOrderStatus();
                const sellOrderStatus = getRandomOrderStatus();
                // Step 5: If a buy order is filled, place a new sell order at the updated price
                if (buyOrderStatus === 'FILLED') {
                    console.log(`[BOT] Buy order filled at ${buyPrice}. Placing a new sell order.`);
                    // sellOrderId = await placeSellOrder(sellPrice, orderSize);
                    lastBuy = buyPrice * orderSize;
                    buyOrderId = null; // Reset buy order ID
                }
                // Step 6: If a sell order is filled, place a new buy order at the updated price
                if (sellOrderStatus === 'FILLED') {
                    console.log(`[BOT] Sell order filled at ${sellPrice}. Placing a new buy order.`);
                    lastSell = sellPrice * orderSize;
                    lastProfit = lastBuy - lastSell;
                    totalProfit = totalProfit + lastProfit;
                    console.log(`--------------------------`);
                    console.log(`Last Profit: ${lastProfit}`);
                    console.log(`Total Profit: ${totalProfit}`);
                    // buyOrderId = await placeBuyOrder(buyPrice, orderSize);
                    sellOrderId = null; // Reset sell order ID
                }
                // Wait before checking again
                yield new Promise((resolve) => setTimeout(resolve, 4000));
            }
        }
        catch (error) {
            console.error(`[BOT] Error`);
        }
    });
}
//# sourceMappingURL=market-maker.js.map