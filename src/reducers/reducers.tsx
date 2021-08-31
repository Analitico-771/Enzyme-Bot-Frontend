
import {SUBMIT} from '../actions/types';
import {SWAPTRADE} from '../actions/types';
import {ADDASSETS} from '../actions/types';
import {ADDHOLDINGS} from '../actions/types';
// import {INCREMENT} from '../actions/types';
// import {DECREMENT} from '../actions/types';

const allreducers = (state: any, action: any) => {
    
    if(state == null){
        state = {
            envVariables: [],
            swapTrade: [],
            reduxAssets: [],
            reduxHoldings: []
        }
    }

    switch(action.type){

        case SUBMIT:
            // [].includes(searchCriteria)
            // console.log("action.data ", action.data);
            return {
                ...state, 
                envVariables: action.data
                // lastAddress: action.data.address,
                // address: [...state.address, action.data.address]
                }
        
        case SWAPTRADE:
            // [].includes(searchCriteria)
            // console.log("action.data ", action.data);
            return {
                ...state, 
                swapTrade: action.data
                // lastAddress: action.data.address,
                // address: [...state.address, action.data.address]
                }
        
        case ADDASSETS:
            // [].includes(searchCriteria)
            // console.log("assets action.data ", action.data);
            return {
                ...state, 
                reduxAssets: action.data
                // lastAddress: action.data.address,
                // address: [...state.address, action.data.address]
                }
        
        case ADDHOLDINGS:
            // [].includes(searchCriteria)
            // console.log("holdings action.data ", action.data);
            return {
                ...state, 
                reduxHoldings: action.data
                // lastAddress: action.data.address,
                // address: [...state.address, action.data.address]
                }

        // case REMOVE:
        //     let arrayCopy = [...state.address];
        //     // console.log(action)
        //     let newArray = arrayCopy.filter(address => address !== action.address)
        //     // console.log(newArray)
        //     return {
        //         ...state,
        //         address: newArray
        //     }

        // case INCREMENT:
        //     return {
        //         ...state, 
        //         counter: state.counter + action.data
        //     }

        // case DECREMENT:
        //     return {
        //         ...state, 
        //         counter: state.counter - action.data
        //     }
            
        default:
            return state;
    }
}

export default allreducers;