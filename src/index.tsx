import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Client from './Client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.min.js', { scope: '/' }).then(reg => {
    const worker = reg.active || reg.waiting || reg.installing
    function checkState(worker: any) {
      if (worker.state !== 'activated') { return false }
      if (!('createServer' in Client)) { return false }
      return Client.createServer({ controller: reg })
    }
    if (!checkState(worker) && worker) {
      worker.addEventListener('statechange', ({ target }) => checkState(target))
    }
  })
} else {
  console.log('service worker not supported');
}