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
function marketMakingBot() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Market-making bot is running');
    });
}
// export async function marketMakingBot() {
//   const price = await getAggregatedPrice();
//   const spread = 0.01; // Example 1% spread
//   const buyPrice = price * (1 - spread);
//   const sellPrice = price * (1 + spread);
//   console.log(`Placing buy order at ${buyPrice} and sell order at ${sellPrice}`);
// }
//# sourceMappingURL=market-maker.js.map