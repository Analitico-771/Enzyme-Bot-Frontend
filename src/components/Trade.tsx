

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import env from '../env';
import { config } from 'dotenv';
import { SwapTrade } from '../enzyme-bot/src/SwapTrade';
import { swap } from '../enzyme-bot/src/components/index';
import { getCurrentHoldings } from '../enzyme-bot/src/utils/Helpers';
import { main } from '../enzyme-bot/src/components/index';
import EnvVariablesForm from './forms/EnvVariablesForm';
import SwapTradeForm from './forms/SwapTradeForm';
import CurrentHoldings from '../components/subComponents/CurrentHoldings'
import TradingAssets from '../components/subComponents/TradingAssets';
import { addHoldings } from "../actions/actions";
import '../App.css';
// import { EnzymeBot } from "../enzyme-bot/src/EnzymeBot";
// import { run } from '../enzyme-bot/src/components/index';

config();
const user = `Anonymous`;

function Trades () {

  const [currentPrice, setcurrentPrice] = useState([]);
  const botVariables = useSelector((state: any) => state.combReducers.envVariables);
  const tradeVariables = useSelector((state: any) => state.combReducers.swapTrade);
  const assetsList = useSelector((state: any) => state.combReducers.reduxAssets);
  const holdingsList = useSelector((state: any) => state.combReducers.reduxHoldings);
  const dispatch = useDispatch();

  useEffect( () => {
    //*componentDidUnmount - clean up function
    //   return () => {
    //     effect
    //   };
  }, [currentPrice, tradeVariables, botVariables])
  
  const getcurrentPrice = async () => {
    //api call for price information
    const url = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${env.apiKey}`;
    try{
      const response: any = await fetch(url);//api call for price information
      const symbolData: any = await response.json();
      const price = symbolData.result.ethusd;
      // console.log("symbolData", price);
      setcurrentPrice(price);
    }catch(err){
      console.log("error with price api", err);
    }
  }
  
  const getMyHoldings = async () => {
    try{
      const data: any = await getCurrentHoldings();
      // console.log("Trade.tsx holdings ", holdingsList)
      await dispatch(addHoldings(data));
    }catch(err){
      alert(`Error fetching assets ${err}`);
    };
  }

  const handleClick = async (input: any) => {

    switch(input){
      case "trade":
        await main();
        console.log('trade function');
        // console.log(currentPrice);
        setTimeout(() => {
          getMyHoldings();
          getcurrentPrice();
          // console.log('trade function');
        }, 300 * 60);
      break;

      case "swap-trade":
        //need to resolve the tradeVariables to their respective object.
        //Loop through asset object to find the buyAsset
        //get the sell amount
        //loop trough the holdings object to find the sellAsset
        //get the buy amount
        console.log("assets", assetsList[0].symbol);
        // console.log("holdingsList", holdingsList[0].symbol);
        var buyAsset: any = []; 
        assetsList.forEach((asset: any, index: any) => {
          if(asset.symbol === tradeVariables.buyAsset) {
            buyAsset = assetsList[index];
            // console.log("assetsList[index]", assetsList[index]);
            console.log("assetsList[index]", buyAsset);
          }
        });
        var sellAsset: any = []; 
        // holdingsList.forEach((holding: any, index: any) => {
        //   if(holding.symbol === tradeVariables.sellAsset) {
        //     sellAsset = holdingsList[index];
        //     // console.log("assetsList[index]", assetsList[index]);
        //     console.log("holdingsList[index]", sellAsset);
        //   }
        // });
        await swap(await SwapTrade.create('KOVAN', buyAsset, sellAsset));
        console.log('swap-trade function');
        console.log(currentPrice);
        setTimeout(() => {
          getMyHoldings();
          getcurrentPrice();
          // console.log('trade function');
          // console.log("setTimeout",currentPrice);
        }, 300 * 60);
      break;

      default:
        console.log('Switch not working');
      break;
    }
  }

  return (

    <div>
      <div className="content">
        <div className="vertical-split">
          <div className="card bg-dark text-white">
            <div className="card-header">Welcome {`${user}`}</div>
            <div className="card-body">
              Enter the Environmental Variables<br /><br />
              <EnvVariablesForm />
            </div>
          </div>  
          <div className="card bg-dark text-white">
            <div className="card-header">Trade Strategies</div>
              <div className="card-body">
                <div className="address-list">
                    <div className="card-body address-list">
                      <br />
                      <button className="trade-button" onClick={()=>handleClick("trade") }>
                        Algo Trade
                      </button>
                      <br /> <br />
                      <SwapTradeForm />
                      <button className="trade-button" onClick={()=>handleClick("swap-trade") }>
                          Swap Trade
                      </button>
                    </div>
                    
                </div>
              </div>
          </div>
        </div>
        <div className="vertical">
          <div className="card bg-dark text-white">
            <div className="card-header">Asset Holdings for Enzyme Vault :<span>{<span> {'\u00A0'} </span> }</span> {env.enzymeVaultAddress}
              <div className="d-flex flex-row blockchain-txns-header">
                <div className="flex-fill p-2 blockchain-txns-header-hash">Name</div>
                <div className="flex-fill p-2 blockchain-txns-header-hash">Symbol</div>
                <div className="flex-fill p-2 blockchain-txns-header-hash">Price</div>
                <div className="flex-fill p-2 blockchain-txns-header-hash">Amount</div>
                <div className="flex-fill p-2 blockchain-txns-header-hash">Value</div>
              </div>
            </div>

              <CurrentHoldings />
              
            <div className="mt-5 card-body d-flex flex-column">Available Trading Assets - UNISWAP
              <div className="d-flex flex-row">
                <div className="flex-fill p-2 blockchain-txns-header-hash">Name</div>
                <div className="flex-fill p-2 blockchain-txns-header-hash">Symbol</div>
                <div className="flex-fill p-2 blockchain-txns-header-hash">Price</div>

              </div>

                <TradingAssets />
                
            </div>
          </div>
        </div>
      </div>
  </div>
  ); 
}
  
export default Trades;