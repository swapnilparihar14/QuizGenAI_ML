import { createStore, applyMiddleware } from "redux";
import { persistStore } from 'redux-persist';
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};

const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(thunk)));

const persistor = persistStore(store);

const stores = {store, persistor};

export default stores;