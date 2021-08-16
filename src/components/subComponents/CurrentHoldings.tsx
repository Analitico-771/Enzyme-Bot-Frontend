
import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from 'react-redux';
// import { addHoldings } from '../../actions/actions';
import { convertedValue } from '../helpers';
import { getCurrentHoldings } from '../../enzyme-bot/src/utils/Helpers';
import env from '../../env';

const CurrentHoldings = () => {

    const [currentPrice, setcurrentPrice] = useState([]);
    const [currentHoldings, setcurrentHoldings] = useState([]);
    // const holdingsList = useSelector((state: any) => state.combReducers.reduxHoldings);
    // const dispatch = useDispatch();

    useEffect(() => {
        getcurrentPrice();
        getMyHoldings();
        console.log('currentHoldings.tsx component did mount');
        // console.log('currentPrcie', currentPrice);
        //*componentDidUnmount - clean up function
        //   return () => {
        //     effect
        //   };
    }, [currentPrice ])//componenentDidMount

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

    const getMyHoldings = () => {
        let currentHoldingsCopy: any = getCurrentHoldings()
        .then( data => {
            currentHoldingsCopy = data;
          setcurrentHoldings(currentHoldingsCopy);
        //   dispatch(addHoldings(currentHoldingsCopy));//giving me issues with addAssets
        //   console.log('current holdings', currentHoldingsCopy);
        });
    }
    
    // console.log("holdingsList", holdingsList);

    return <>
        <div className="d-flex flex-column">
            {currentHoldings && currentHoldings.map((currentHoldingsObj: any) => {
                return <>
                    <div className="d-flex flex-row blockchain-txns">
                        <div className="flex-fill p-2 blockchain-txns-hash">{`${currentHoldingsObj.name}`}</div>
                        <div className="flex-fill p-2 blockchain-txns-hash">{`${currentHoldingsObj.symbol}`}</div>
                        <div className="flex-fill p-2 blockchain-txns-hash">{`${currentHoldingsObj.price.price * Number(currentPrice)}`}</div>
                        <div className="flex-fill p-2 blockchain-txns-hash">{`${convertedValue(currentHoldingsObj.amount)}`}</div>
                        <div className="flex-fill p-2 blockchain-txns-hash">{`${(currentHoldingsObj.price.price * Number(currentPrice)) * convertedValue(currentHoldingsObj.amount)}`}</div>
                    </div>
                </>;
            })}
        </div>
    </>
}

export default CurrentHoldings