import { getLatestWeightedAggregatedPrice, startPriceFeed, startSimulatedFeed } from '@market-making-bot/price-feed';
// import { placeBuyOrder, placeSellOrder, cancelOrder, getOrderStatus } from './exchange-api'; // Assume exchange API integration

// Define parameters
const spread = 0.01;
const orderSize = 0.001;

let buyOrderId: string | null = null;
let sellOrderId: string | null = null;

// Used to calculate profit
let histData = false
let lastBuy: number | 0 = 0;
let lastSell: number | 0 = 0;
let lastProfit: number | 0 = 0;
let totalProfit: number | 0 = 0;

// Starts the price feed for websockets
if(histData) {
  startSimulatedFeed()
}
else {
  startPriceFeed()
}


// Function to calculate the buy and sell prices based on the spread
function calculateOrderPrices(marketPrice: number): { buyPrice: number; sellPrice: number } {
  const buyPrice = marketPrice * (1 - spread);
  const sellPrice = marketPrice * (1 + spread);
  return { buyPrice, sellPrice };
}

// Mock data for orders being filled
// TODO: Implement API calls for orders once accts are setup
function getRandomOrderStatus(): "FILLED" | "NOT" {
  return Math.random() < 0.5 ? "FILLED" : "NOT";
}

export async function marketMakingBot() {
  try {
    while (true) {
      // Step 1: Start price feed from web socks for the current market price from external exchanges      
      const marketPrice = getLatestWeightedAggregatedPrice();
      console.log(`[BOT] Current market price: ${marketPrice}`);

      // Step 2: Calculate buy and sell prices based on the market price
      const { buyPrice, sellPrice } = calculateOrderPrices(marketPrice);
      console.log(`[BOT] Placing buy order at: ${buyPrice}, sell order at: ${sellPrice}`);

      // Step 3: Place the buy and sell orders if they are not already placed
      if (!buyOrderId) {
        // TODO: Implment API call
        // buyOrderId = await placeBuyOrder(buyPrice, orderSize);
        buyOrderId = "0009"
      }
      if (!sellOrderId) {
        // TODO: Implment API call
        // sellOrderId = await placeSellOrder(sellPrice, orderSize);
        sellOrderId = "0001"
      }

      // Step 4: Monitor the status of the buy and sell orders
      const buyOrderStatus = getRandomOrderStatus();
      const sellOrderStatus = getRandomOrderStatus();


      // Step 5: If a buy order is filled, place a new sell order at the updated price
      if (buyOrderStatus === 'FILLED') {
        console.log(`[BOT] Buy order filled at ${buyPrice}. Placing a new sell order.`);
        // sellOrderId = await placeSellOrder(sellPrice, orderSize);
        lastBuy = buyPrice * orderSize
        buyOrderId = null; // Reset buy order ID
      }

      // Step 6: If a sell order is filled, place a new buy order at the updated price
      if (sellOrderStatus === 'FILLED') {
        console.log(`[BOT] Sell order filled at ${sellPrice}. Placing a new buy order.`);
        lastSell = sellPrice * orderSize
        lastProfit = lastBuy - lastSell
        totalProfit = totalProfit + lastProfit
        console.log(`--------------------------`);
        console.log(`Last Profit: ${lastProfit}`);
        console.log(`Total Profit: ${totalProfit}`);

        // buyOrderId = await placeBuyOrder(buyPrice, orderSize);
        sellOrderId = null; // Reset sell order ID
      }

      // Wait before checking again
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }
  } catch (error) {
    console.error(`[BOT] Error`);
  }
}
