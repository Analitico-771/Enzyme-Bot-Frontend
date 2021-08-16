

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import '../App.css';
import { EnzymeBot } from "../enzyme-bot/src/EnzymeBot";
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
import { getAssetList } from '../enzyme-bot/src/utils/Helpers';
// import { swapTrade, addAssets, addHoldings } from '../actions/actions';
// import {convertedValue} from './helpers';
// import CurrentHoldings from "./CurrentHoldings";
// import { getPrice } from '../enzyme-bot/src/utils/Helpers';
// import { EnzymeBot } from '../enzyme-bot/src/EnzymeBot';
// import React, {useState, useEffect} from "react";
// import { run } from '../enzyme-bot/src/components/index';
// import { getHoldings } from '../enzyme-bot/src/EnzymeBot';
// import { getcurrentPrice } from './helpers';
// import { loadEnv } from '../enzyme-bot/src/utils/loadEnv';

config();
const user = `Anonymous`;

function Trades () {
  const [currentHoldings, setcurrentHoldings] = useState([]);
  const [currentAssets, setcurrentAssets] = useState([]);
  const [currentPrice, setcurrentPrice] = useState([]);
  const botVariables = useSelector((state: any) => state.combReducers.envVariables);
  const tradeVariables = useSelector((state: any) => state.combReducers.swapTrade);
  const assetsList = useSelector((state: any) => state.combReducers.reduxAssets);
  const holdingsList = useSelector((state: any) => state.combReducers.reduxHoldings);
  const dispatch = useDispatch();
  // var assets: any;

  useEffect( () => {
    
    getMyHoldings();
    // getCurrentAssets();
    // getcurrentPrice();
    console.log('Trade.tsx component did mount');
  //   console.log(currentPrice);
  //   console.log("Trade.tsx tradeVariables", tradeVariables);
  }, [currentPrice, tradeVariables])
  // })//, [currentPrice])

  // console.log('assetsList', assetsList);

  const getMyHoldings = () => {
    let currentHoldingsCopy: any = getCurrentHoldings()
    .then( data => {
      currentHoldingsCopy = data;
      setcurrentHoldings(currentHoldingsCopy);
      // dispatch(addHoldings(currentHoldingsCopy));//giving me issues with addAssets
      // console.log('current holdings', currentHoldingsCopy);
    });
  }
  
  const getcurrentPrice = async () => {
    //api call for price information
    const url = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${env.apiKey}`;
    try{
      let response: any = await fetch(url);//api call for price information
      let symbolData: any = await response.json();
      // console.log("symbolData", symbolData.result.ethusd);
      setcurrentPrice(symbolData.result.ethusd);
    }catch(err){
      console.log("error with price api", err);
    }
  }

  // const getCurrentAssets = async () => {
  //   const assets: any = await getAssetList();
  //   console.log("assets", assets);
  //   // console.log("assets", assets[0]);
  //   setcurrentAssets(assets);
  //   dispatch(addAssets(assets));
  // }

  const handleClick = async (input: any) => {

    // console.log(`Hello World! I'm the Enzyme Crypto-Bot`);

    switch(input){
      case "trade":
        await main();
        console.log('trade function');
        // console.log(currentPrice);
        setTimeout(() => {
          getMyHoldings();
          getcurrentPrice();
          // console.log('trade function');
          // console.log("setTimeout", currentPrice);
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
                      {/* <h3 className="text-danger">Hello World! I'm the Enzyme Crypto-Bot</h3> */}
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
              {/* {showERC20 ? <HeaderERC20 /> : <Header />} */}
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