
// import React from 'react';
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addAssets } from '../../actions/actions';
import { getAssetList } from '../../enzyme-bot/src/utils/Helpers';
import { convertedValue } from '../helpers';
import env from '../../env';

const TradingAssets = () => {
    
    const [currentAssets, setcurrentAssets] = useState([]);
    const [currentPrice, setcurrentPrice] = useState([]);
    const assetsList = useSelector((state: any) => state.combReducers.reduxAssets);
    const dispatch = useDispatch();
    // var assets: any;

    useEffect(() => {
        getcurrentPrice();
        // getCurrentAssets();
        console.log('tradingAssets.tsx component did mount');
        // console.log('currentPrcie', currentPrice);
        //*componentDidUnmount - clean up function
        //   return () => {
        //     effect
        //   };
    }, [currentPrice])//componenentDidMount

    // console.log(props)
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

    const getCurrentAssets = async () => {
        const assets: any = await getAssetList();
        console.log("assets", assets);
        // console.log("assets", assets[0]);
        // setcurrentAssets(assets);
        dispatch(addAssets(assets));
    }

    return <>
        
        {assetsList && assetsList.map((assetsListObj: any) => {
            return <>
            <div className="d-flex flex-row blockchain-txns">
                <div className="flex-fill p-2 blockchain-txns-hash">{`${assetsListObj.name}`}</div>
                <div className="flex-fill p-2 blockchain-txns-hash">{`${assetsListObj.symbol}`}</div>
                <div className="flex-fill p-2 blockchain-txns-hash">{`${assetsListObj.price.price * Number(currentPrice)}`}</div>               
            </div>
        </>;
        })}
    </>
}

export default TradingAssets