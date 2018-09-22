import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Auth from './components/Auth';
import Data from './components/Data';

class App extends Component {
  render() {
    return (
      <div>
        <Data/>
        <Auth/>
      </div>
    );
  }
}

export default App;
