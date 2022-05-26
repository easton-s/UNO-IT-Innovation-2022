import React from "react";
import { Route, BrowserRouter as Router, Routes as Switch } from "react-router-dom";

import Home from './Components/Home';
import Category from './Components/Category';

const App = ({ socket })=>{

  socket.on('connect', ()=>{
    console.log('[!] Connected to socket');
  });

  return (
    <Router>
      <Switch>
        <Route path="/" element={<Home socket={socket}/>}/>

        <Route path="/category/:category" element={<Category socket={socket}/>}/>
      </Switch>
    </Router>
  );
}

export default App;
