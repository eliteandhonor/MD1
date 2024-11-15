import React from 'react';
import MindMap from './components/MindMap';
import DigitalRain from './components/DigitalRain';

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <DigitalRain />
      <MindMap />
    </div>
  );
}

export default App;