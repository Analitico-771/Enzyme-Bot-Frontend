import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { convertedValue } from "./helpers";
import '../App.css';

const CurrentHoldings = (props: any) => {
    // let currentPrice: any;
    const [currentPrice, setcurrentPrice] = useState([]);

    useEffect( () => {
      GetCurrentPrice();
      console.log('Current Holdings component did mount');
      }, [currentPrice]);

    const GetCurrentPrice = async () => {


        let response: any = await fetch('https://coinograph.io/ticker/?symbol=gdax:ethusd'); //api call for symbol information
        let symbolData: any = await response.json();
        console.log("symbolData", symbolData.price);
        // setcurrentPrice(symbolData.price);
        return symbolData.price;
    }

    // console.log(props)
  
    return (
      <div >
        {/* <h3 className="text-warning"> {props.title} {'\u00A0'}</h3> */}
        <div className="d-flex flex-row blockchain-txns">
            <div className="flex-fill p-2 blockchain-txns-hash">{`${props.name}`}</div>
            <div className="flex-fill p-2 blockchain-txns-hash">{`${props.symbol}`}</div>
            <div className="flex-fill p-2 blockchain-txns-hash">{`${props.price.price * Number(currentPrice)}`}</div>
            <div className="flex-fill p-2 blockchain-txns-hash">{`${convertedValue(props.amount)}`}</div>
            <div className="flex-fill p-2 blockchain-txns-hash">{`${(props.price.price * Number(currentPrice)) * convertedValue(props.amount)}`}</div>
                              
        </div>  
      </div>
    )
  }
  
  export default CurrentHoldings