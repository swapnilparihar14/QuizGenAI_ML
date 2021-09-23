import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import stores from "./store";


ReactDOM.render(
  <Provider store={stores.store}>
    <React.StrictMode>
      <PersistGate persistor={stores.persistor}>
        <App />
      </PersistGate>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);


