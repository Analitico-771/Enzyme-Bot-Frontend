
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addAssets } from '../../actions/actions';
import { getAssetList } from '../../enzyme-bot/src/utils/Helpers';
import env from '../../env';

const TradingAssets = () => {
    
    const [currentPrice, setcurrentPrice] = useState([]);
    const assetsList = useSelector((state: any) => state.combReducers.reduxAssets);
    const dispatch = useDispatch();

    useEffect(() => {
        getcurrentPrice();
        getCurrentAssets();
        console.log('tradingAssets.tsx component did mount');
    }, [currentPrice ]);
    
    const getCurrentAssets = async () => {
        try{
            const assets: any = await getAssetList();
            // console.log("assets", assets[0]);
            await dispatch(addAssets(assets));
        }catch(err){
            alert(`Error fetching assets ${err}`);
        }; 
    };

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
            alert(`Error with price api ${err}`);
        };
    };

    return <>
        
        {assetsList && assetsList.map((assetsListObj: any) => {
            return <>
            <div className="d-flex flex-row blockchain-txns">
                <div className="flex-fill p-2 blockchain-txns-hash">{`${assetsListObj.name}`}</div>
                <div className="flex-fill p-2 blockchain-txns-hash">{`${assetsListObj.symbol}`}</div>
                <div className="flex-fill p-2 blockchain-txns-hash">{`${assetsListObj.price.price * Number(currentPrice)}`}</div>               
            </div>
        </>;
        })};
    </>
}

export default TradingAssets