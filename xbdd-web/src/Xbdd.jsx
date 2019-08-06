import React from 'react';
import Navbar from './modules/Navbar';
import Viewer from './modules/Viewer';
import './Xbdd.css';

const Xbdd = () => {
  return (
    <div className="xbdd-app">
        <Navbar />
        <Viewer />
    </div>
  );
};

export default Xbdd;
