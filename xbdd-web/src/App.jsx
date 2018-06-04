import React from 'react';
import FeatureSummaryViewContainer from './containers/FeatureSummaryViewContainer';
import './App.css';
import Feature from './models/Feature';
import data from './resources/dummyFeatureData.json';
import FeatureHistory from './models/FeatureHistory';
import featureRollupData from './resources/dummyFeatureRollupData.json';

const App = () => (
    <div className="App">
        <FeatureSummaryViewContainer
            featureRollupData={new FeatureHistory(featureRollupData)}
        />
    </div>
);

export default App;
