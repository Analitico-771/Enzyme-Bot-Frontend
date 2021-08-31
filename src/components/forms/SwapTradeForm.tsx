
import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { swapTrade } from '../../actions/actions';
// import { SwapTrades } from "../Trade";
//import env from '../../env';

const SwapTradeForm = () => {
  const [sellAsset, setsellAssetValue] = useState('');
  //const [sellAssetAmount, setsellAssetAmountValue] = useState('');
  const [buyAsset, setbuyAssetValue] = useState('');
  //const [buyAssetAmount, setbuyAssetAmountValue] = useState('');

  const tradeVariables = useSelector((state: any) => state.combReducers.swapTrade);
  const dispatch = useDispatch();

  useEffect(  () => {
    console.log('SwapTradeForm component did mount');
    // console.log(tradeVariables);
    }, [tradeVariables])

  const handleForm = (e: any) => {
    e.preventDefault();

    //SwapTradeVariables is adjusted based on the SellAmount strategy for the swap-trade function.
    //This feeds the Redux that sends the trade info to the Bot
    const SwapTradeVariables = {
      sellAsset: sellAsset,
      // sellAssetAmount: sellAssetAmount,
      buyAsset: buyAsset,
      // buyAssetAmount: buyAsset
    };
    // console.log(SwapTradeVariables);
    // console.log(SwapTradeVariables);

    //dispatch redux
    dispatch(swapTrade(SwapTradeVariables));
    //clear the form after dispatch
    setsellAssetValue("");
    // setsellAssetAmountValue("");
    setbuyAssetValue("");
    // setbuyAssetAmountValue("");
    // console.log("tradeVariables", tradeVariables)
  }

  //The form input below are for placeholder. I'm not sure yet of which fields are needed for a swap-trade.
  //The BuyAmount should be calculated based on the SellAmount results - or buy as many as possible based on the SellAmount results
  //The form is easy to be modified and the Redux adjusted accordingly
  return <>
    <div className="form-group fg--search">
      <form onSubmit={handleForm}>
        <input className="input" onSubmit={handleForm} type="text" value={sellAsset} placeholder="Sell Token" onChange={(e)=>setsellAssetValue(e.target.value)} />
        <br />
        {/* <input className="input" onSubmit={handleForm} type="text" value={sellAssetAmount} placeholder="Sell Amount" onChange={(e)=>setsellAssetAmountValue(e.target.value)} />
        <br /> */}
        <input className="input" onSubmit={handleForm} type="text" value={buyAsset} placeholder="Buy Token" onChange={(e)=>setbuyAssetValue(e.target.value)} />
        <br />
        {/* <input className="input" onSubmit={handleForm} type="text" value={buyAssetAmount} placeholder="Buy Amount" onChange={(e)=>setbuyAssetAmountValue(e.target.value)} />
        <br /> */}
        {/* <button className="submit-button" type="submit" onClick={()=>SwapTrades()}>Execute Swap</button> */}
        <button className="submit-button" type="submit">Submit Swap</button>
      </form>
    </div>
  </>;
};

export default SwapTradeForm;