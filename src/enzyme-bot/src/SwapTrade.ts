
import {
  callOnIntegrationArgs,
  ComptrollerLib,
  IntegrationManagerActionId,
  takeOrderSelector,
  uniswapV2TakeOrderArgs,
  // ValueInterpreter,
  VaultLib,
} from '@enzymefinance/protocol';
import { BigNumber, providers, utils, Wallet } from 'ethers';
import { getDeployment } from './utils/getDeployment';
import { getProvider } from './utils/getProvider';
import { getToken, getTokens } from './utils/getToken';
import { getTokenBalance } from './utils/getTokenBalance';
import { getVaultInfo } from './utils/getVault';
import { getWallet } from './utils/getWallet';
import { AssetsQuery, CurrentReleaseContractsQuery, VaultQuery } from './utils/subgraph/subgraph';
import { getTradeDetails, TokenBasics } from './utils/uniswap/getTradeDetails';
import env from '../../env';

export class SwapTrade {
  
  public static async create(network: 'KOVAN' | 'MAINNET', buyAsset: any, sellAsset: any) {
    
    const subgraphEndpoint =
      network === 'MAINNET' ? env.mainnetSubgraphEndPoint : env.kovanSubgraphEndPoint;
    const key = network === 'MAINNET' ? env.mainnetPrivateKey : env.kovanPrivateKey;
    const contracts = await getDeployment(subgraphEndpoint);
    const tokens = await getTokens(subgraphEndpoint);
    const provider = getProvider('KOVAN');
    const wallet = getWallet(key, provider);
    const vaultAddress = env.enzymeVaultAddress;
    const vault = await getVaultInfo(subgraphEndpoint, vaultAddress);

    return new this(network, sellAsset, buyAsset, contracts, tokens, wallet, vaultAddress, vault, provider, subgraphEndpoint);
  }

  private constructor(
    public readonly network: 'KOVAN' | 'MAINNET',
    public readonly sellAsset: any,
    // public readonly sellAssetAmount: any,
    public readonly buyAsset: any,
    // public readonly buyAssetAmount: any,
    public readonly contracts: CurrentReleaseContractsQuery,
    public readonly tokens: AssetsQuery,
    public readonly wallet: Wallet,
    public readonly vaultAddress: string,
    public readonly vault: VaultQuery,
    public readonly provider: providers.JsonRpcProvider,
    public readonly subgraphEndpoint: string
  ) {}

  // THIS IS PART OF THE TRADE FUNCTION
  public async getBuyToken() {
    const comptrollerAddress = this.vault.fund?.accessor.id;
    const release = this.vault.fund?.release.id
    
    if (!comptrollerAddress || !release) {
      // console.log("Break 1");
      return undefined;
    }
    
    const assets = this.tokens.assets.filter((asset) => !asset.derivativeType);
    // console.log("assets", assets);

    const releaseAssets = assets.filter((asset) =>
      asset.releases.map((innerRelease) => innerRelease.id).includes(release)
    );

    if (!releaseAssets || releaseAssets.length === 0) {
      return undefined;
    }

    // THIS CHOOSES RANDOM ASSETS
    // const length = releaseAssets.length;
    // const random = Math.floor(Math.random() * length);
    const id = this.sellAsset.id;
    // console.log(random);
    // console.log("releasedAssets", releaseAssets[random]);
    return releaseAssets[id];
  }
  public async getHoldings() {
    // console.log("this.buyAsset", this.buyAsset);
    const vault = new VaultLib(this.vaultAddress, this.wallet);
    const holdings = await vault.getTrackedAssets();
    return Promise.all(holdings.map((item: string) => getToken(this.subgraphEndpoint, 'id', item.toLowerCase())));
    
  }

  public async getPrice(buyToken: TokenBasics, sellToken: TokenBasics, sellTokenAmount: BigNumber) {
    const details = await getTradeDetails(this.network, sellToken, buyToken, sellTokenAmount);

    return details;
  }

  public async swapTokens(trade: {
    path: string[];
    minIncomingAssetAmount: BigNumber;
    outgoingAssetAmount: BigNumber;
  }) {
    const adapter = this.contracts.network?.currentRelease?.uniswapV2Adapter;
    const integrationManager = this.contracts.network?.currentRelease?.integrationManager;
    const comptroller = this.vault.fund?.accessor.id
    
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

    const contract = new ComptrollerLib(comptroller, this.wallet);

    return contract.callOnExtension.args(integrationManager, IntegrationManagerActionId.CallOnIntegration, callArgs);
  }

    // THIS IS THE TRADE FUNCTION
  public async tradeSwapTrade() {
    // get a random token
    // const randomToken = await this.chooseRandomAsset();

    // if no random token return, or if the random token is a derivative that's not available on Uniswap
    // if (!randomToken || randomToken.derivativeType) {
    //   console.log("The Miner's Delight did not find an appropriate token to buy.");
    //   return;
    // }

    // get your fund's holdings
    const vaultHoldings = await this.getHoldings();
    console.log("this.buyAsset", this.buyAsset);
    // if you have no holdings, return
    if (vaultHoldings.length === 0) {
      console.log('Your fund has no assets.');
      return;
    }
    // console.log(this.buyAsset.id);
    // if your vault already holds the sellToken token, return
    if (vaultHoldings.map((holding) => holding?.id.toLowerCase()).includes(this.buyAsset.id.toLowerCase())) {
      console.log("You already hold the asset that the Miner's Delight randomly selected.");
      return;
    }

    // get the amount of each holding
    const holdingAmounts = await Promise.all(
      vaultHoldings.map((holding) => getTokenBalance(this.vaultAddress, holding!.id, this.network))
    );

    // combine holding token data with amounts
    const holdingsWithAmounts = vaultHoldings.map((item, index) => {
      return { ...item, amount: holdingAmounts[index] };
    });

    // console.log("holdings", holdingsWithAmounts);

    // find the token you will sell by searching for largest token holding
    // const biggestPosition = holdingsWithAmounts.reduce((carry, current) => {
    //   if (current.amount.gte(carry.amount)) {
    //     return current;
    //   }
    //   return carry;
    // }, holdingsWithAmounts[0]);
    // console.log("this.buyAsset.decimals", this.buyAsset.decimals);
    // console.log("this.buyAsset.symbol", this.buyAsset.symbol);
    // console.log("this.buyAsset.name", this.buyAsset.name);
    console.log("this.sellAsset.decimals", this.sellAsset.decimals);
    console.log("this.sellAsset.symbol", this.sellAsset.symbol);
    console.log("this.sellAsset.name", this.sellAsset.name);
    console.log(
      `The Miner's Delight has chosen. You will trade ${utils.formatUnits(
        this.sellAsset.amount,
        this.sellAsset.decimals
      )} ${this.sellAsset.name} (${this.sellAsset.symbol}) for as many ${this.buyAsset.name} (${
        this.buyAsset.symbol
      }) as you can get.`
    );
    // console.log("this.buyAsset.decimals", this.buyAsset.decimals);
    // console.log("this.buyAsset.symbol", this.buyAsset.symbol);
    // console.log("this.buyAsset.name", this.buyAsset.name);
    // get the trade data
    const price = await this.getPrice(
      { id: this.buyAsset.id, decimals: this.buyAsset.decimals, symbol: this.buyAsset.symbol, name: this.buyAsset.name },
      {
        id: this.sellAsset.id as string,
        decimals: this.sellAsset.id.decimals as number,
        symbol: this.sellAsset.id.symbol as string,
        name: this.sellAsset.id.name as string,
      },
      this.sellAsset.amount
    );

    // call the transaction
    return this.swapTokens(price);
  }
}
