1. This app is the front-end for the Enzyme-bot and the Enzyme-protocol.  It provides a UI to execute bot-trade functions and display data about the trade and data about the user's Enzyme Vault. The Enzyme-bot and the Enzyme-protocol are repositories in GitHub and the links are placed below.  I started the project as a means to learn Web3, Solidity, and Smart Contract coding and in the end I also learned TypeScript.  I also built this front-end as part of a DeFi Summer hackathon so I can develop, learn, and code under a deadline. 
    https://github.com/avantgardefinance/enzyme-bot/
    https://github.com/enzymefinance/protocol

    To make the app work for you you will need to create an env.ts file in the react-app src folder.  This is where the environmental variables are being held.  The Env Var Form is also working but I prefer to use the env.ts file.  For now, a manual switch from from to env.ts file is required.

    A link to the Demo of the app
    - https://youtu.be/Hdj2ur4Mmjs

2. M.V.P
    *Provide the following:
    - Securely connect to Enzyme-bot
    - Execute the basic strategy from the Front-end
    - Display the results of the trade on the Front-end
    - Display asset information about the Vault
    - Display available Enzyme tradeable assets

3. Color schemes 
- I used bootstrap cards
- The colors used are #007bff, #1d1d1d, and #95999c

* Title Enzyme-bot Front-end

* Overview
This app is the front-end for the Enzyme-bot and the Enzyme-protocol.  It provides a UI to execute bot-trade functions and display data about the trade and data about the user's Enzyme Vault.

* Languages:  TypeScript, React, Redux, CSS, JS, HTML
    * Other: Ethereum, JSON, Postman, Web3, Babelrc, Solidity
     
* Stretch Goals (Future)
    * Additional trade strategies

* Code Snippets

    The code below shows how the Enzyme-bot and Enzyme-protocol functions are integrated in the Frond-end React Application

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
            console.log('Trade.tsx component did mount');
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
                holdingsList.forEach((holding: any, index: any) => {
                if(holding.symbol === tradeVariables.sellAsset) {
                    sellAsset = holdingsList[index];
                    // console.log("assetsList[index]", assetsList[index]);
                    console.log("holdingsList[index]", sellAsset);
                }
                });
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

* Screenshots Of The App
    * ![](/project_images/someimage.jpg)

* Logo
    * ![](/src/components/logo.png)

* Developer Team
    * Jose Tollinchi
    * https://github.com/AnaIitico

* Resources
    * https://github.com/avantgardefinance/enzyme-bot/
    * https://github.com/enzymefinance/protocol
    * https://www.typescriptlang.org/docs/handbook/react.html
    * https://etherscan.io/apis
    * https://web3js.readthedocs.io/en/v1.3.4/
    * https://javascript.info/async
    * https://reactjs.org/
    * https://docs.soliditylang.org/en/v0.5.7/
    * https://eips.ethereum.org/EIPS/eip-20
    * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
    