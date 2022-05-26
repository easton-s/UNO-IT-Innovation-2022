import React from 'react';
import ReactDOM from 'react-dom/client';

import io from "socket.io-client";

import './index.css';
import App from './App';

import { URL } from './Library/url';

const main = () => {
  const socket = io(URL);

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App socket={socket}/>
    </React.StrictMode>
  );
};

main();