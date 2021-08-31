
import env from '../../../env';
import {
  callOnIntegrationArgs,
  ComptrollerLib,
  IntegrationManagerActionId,
  takeOrderSelector,
  uniswapV2TakeOrderArgs,
  // ValueInterpreter,
  VaultLib,
} from '@enzymefinance/protocol';
import { BigNumber } from 'ethers';
// import { getDeployment } from '../utils/getDeployment';
// import { getProvider } from '../utils/getProvider';
import { getToken } from '../utils/getToken';
import { getTokenBalance } from '../utils/getTokenBalance';
// import { getVaultInfo } from '../utils/getVault';
// import { getWallet } from '../utils/getWallet';
// import { AssetsQuery, CurrentReleaseContractsQuery, VaultQuery } from '../utils/subgraph/subgraph';
import { getTradeDetails, TokenBasics } from '../utils/uniswap/getTradeDetails';
import { EnzymeBot } from '../EnzymeBot';

  // THIS IS PART IF THE TRADE FUNCTION
  export async function chooseRandomAsset() {
    const bot = (await EnzymeBot.create(env.botNetwork));
    const comptrollerAddress = bot.vault.fund?.accessor.id;
    const release = bot.vault.fund?.release.id
    
    if (!comptrollerAddress || !release) {
      // console.log("Break 1");
      return undefined;
    }
    
    const assets = bot.tokens.assets.filter((asset) => !asset.derivativeType);
    console.log("assets", assets);

    const releaseAssets = assets.filter((asset) =>
      asset.releases.map((innerRelease) => innerRelease.id).includes(release)
    );

    if (!releaseAssets || releaseAssets.length === 0) {
      return undefined;
    }

    // THIS CHOOSES RANDOM ASSETS
    const length = releaseAssets.length;
    const random = Math.floor(Math.random() * length);

    return releaseAssets[random];
  }

  export async function getAssetList() {
    const bot = (await EnzymeBot.create(env.botNetwork));
    const comptrollerAddress = bot.vault.fund?.accessor.id;
    
    if (!comptrollerAddress) {
      // console.log("Break 1");
      return undefined;
    }
    
    const assets = bot.tokens.assets.filter((asset) => !asset.derivativeType);
    // console.log("assets", assets);

    return assets;
  }

  export async function getHoldings() {
    const bot = (await EnzymeBot.create(env.botNetwork));
    const vault = new VaultLib(bot.vaultAddress, bot.wallet);
    const holdings = await vault.getTrackedAssets();
    return Promise.all(holdings.map((item: string) => getToken(bot.subgraphEndpoint, 'id', item.toLowerCase())));
    
  }

  export async function getPrice(buyToken: TokenBasics, sellToken: TokenBasics, sellTokenAmount: BigNumber) {
    const bot = (await EnzymeBot.create(env.botNetwork));
    const details = await getTradeDetails(bot.network, sellToken, buyToken, sellTokenAmount);

    return details;
  }

  export async function swapTokens(trade: {
    path: string[];
    minIncomingAssetAmount: BigNumber;
    outgoingAssetAmount: BigNumber;
  }) {
    const bot = (await EnzymeBot.create(env.botNetwork));
    const adapter = bot.contracts.network?.currentRelease?.uniswapV2Adapter;
    const integrationManager = bot.contracts.network?.currentRelease?.integrationManager;
    const comptroller = bot.vault.fund?.accessor.id
    
    if (!adapter || !integrationManager || !comptroller) {
      console.log(
        'Missing a contract address. Uniswap Adapter: ',
        adapter,
        ' Integration Manager: ',
        integrationManager
      );
      return;
    }

    const takeOrderArgs = uniswapV2TakeOrderArgs({
      path: trade.path,
      minIncomingAssetAmount: trade.minIncomingAssetAmount,
      outgoingAssetAmount: trade.outgoingAssetAmount,
    });

    const callArgs = callOnIntegrationArgs({
      adapter,
      selector: takeOrderSelector,
      encodedCallArgs: takeOrderArgs,
    });

    const contract = new ComptrollerLib(comptroller, bot.wallet);

    return contract.callOnExtension.args(integrationManager, IntegrationManagerActionId.CallOnIntegration, callArgs);
  }


    // THIS IS THE TRADE FUNCTION
    export async function getCurrentHoldings() {

    // get your fund's holdings
    const bot = (await EnzymeBot.create(env.botNetwork));
    const vaultHoldings = await bot.getHoldings();

    // if you have no holdings, return
    if (vaultHoldings.length === 0) {
      console.log('Your fund has no assets.');
      return;
    }

    // get the amount of each holding
    const holdingAmounts = await Promise.all(
      vaultHoldings.map((holding) => getTokenBalance(bot.vaultAddress, holding!.id, bot.network))
    );

    // combine holding token data with amounts
    const holdingsWithAmounts = vaultHoldings.map((item, index) => {
      return (
        { ...item,
          amount: holdingAmounts[index] });
    });

    // console.log("holdings", holdingsWithAmounts);

    return holdingsWithAmounts;

  }
