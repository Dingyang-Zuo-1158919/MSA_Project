import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import store from './Redux/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // Provider component makes the Redux store available to the rest of the app
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
)
