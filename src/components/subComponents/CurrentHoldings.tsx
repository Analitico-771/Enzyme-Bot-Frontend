
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addHoldings } from '../../actions/actions';
import { convertedValue } from '../helpers';
import { getCurrentHoldings } from '../../enzyme-bot/src/utils/Helpers';
import env from '../../env';

const CurrentHoldings = () => {

    const [currentPrice, setcurrentPrice] = useState([]);
    const holdingsList = useSelector((state: any) => state.combReducers.reduxHoldings);
    const dispatch = useDispatch();

    useEffect(() => {
        getcurrentPrice();
        console.log('currentHoldings.tsx component did mount');
    }, [currentPrice ])

    const getcurrentPrice = async () => {
        //api call for price information
        const url = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${env.apiKey}`;
        try{
            await getMyHoldings();
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
            let data: any = await getCurrentHoldings();
            await dispatch(addHoldings(data));
        }catch(err){
            alert(`Error fetching holdings ${err}`);
        };
    }

    return <>
        <div className="d-flex flex-column">
            {holdingsList && holdingsList.map((holdingsListObj: any) => {
                return <>
                    <div className="d-flex flex-row blockchain-txns">
                        <div className="flex-fill p-2 blockchain-txns-hash">{`${holdingsListObj.name}`}</div>
                        <div className="flex-fill p-2 blockchain-txns-hash">{`${holdingsListObj.symbol}`}</div>
                        <div className="flex-fill p-2 blockchain-txns-hash">{`${holdingsListObj.price.price * Number(currentPrice)}`}</div>
                        <div className="flex-fill p-2 blockchain-txns-hash">{`${convertedValue(holdingsListObj.amount)}`}</div>
                        <div className="flex-fill p-2 blockchain-txns-hash">{`${(holdingsListObj.price.price * Number(currentPrice)) * convertedValue(holdingsListObj.amount)}`}</div>
                    </div>
                </>;
            })}
        </div>
    </>
}

export default CurrentHoldings