
import { combineReducers } from "redux";
import allreducers from './reducers';

let rootReducer = combineReducers({

    combReducers: allreducers

});

export default rootReducer;