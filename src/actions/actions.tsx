
import { SUBMIT } from './types';
import { SWAPTRADE } from './types';
import { ADDASSETS } from './types';
import { ADDHOLDINGS } from './types';
//  import {REMOVE} from './types';
//  import {INCREMENT} from './types';
//  import {DECREMENT} from './types';

export const submit = (d: any) => {
 
  return {
    type: SUBMIT,
    data: d
  };
};

export const swapTrade = (d: any) => {
 
  return {
    type: SWAPTRADE,
    data: d
  };
};

export const addAssets = (d: any) => {
  // console.log("actions assets", d);
  return {
    type: ADDASSETS,
    data: d
  };
};

export const addHoldings = (d: any) => {
  // console.log("actions holdings", d);
  return {
    type: ADDHOLDINGS,
    data: d
  };
};
 
//  export const remove = (t) => {
 
//    return {
//      type: REMOVE,
//      address: t //consider using id
//    };
 
//  };
 
//  export const increment = (n) => {
 
//    return {
//      type: INCREMENT,
//      data: n
//    };
 
//  };
 
//  export const decrement = (n) => {
 
//    return {
//      type: DECREMENT,
//      data: n
//    };
 
//  };
