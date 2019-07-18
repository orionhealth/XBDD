import React from 'react';
import TagListContainer from './modules/tag-list/TagListContainer';
import Navbar from './modules/navbar/Navbar';
import Report from './models/Report';
import './Xbdd.css';
import tagListData from './resources/tag-response.json';

const Xbdd = () => {
  // TODO remove all dummy data once hooked up to backend
  const dummyReport = new Report(tagListData);
  return (
    <div className="xbdd-app">
      <Navbar />
      <TagListContainer report={dummyReport} />
    </div>
  );
};

export default Xbdd;
