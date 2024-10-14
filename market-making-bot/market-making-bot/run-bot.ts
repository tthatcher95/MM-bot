require('module-alias/register');

import { marketMakingBot } from '@market-making-bot/market-maker';

(async () => {
  console.log('Starting market-making bot...');
  await marketMakingBot();
})();
