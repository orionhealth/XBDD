import React from 'react';
import ScenarioListViewContainer from './containers/ScenarioListViewContainer';
import './App.css';
import Feature from './models/Feature';
import data from './resources/dummyFeatureData.json';

const App = () => (
    <div className="App">
        <ScenarioListViewContainer feature={new Feature(data)} />
    </div>
);

export default App;
