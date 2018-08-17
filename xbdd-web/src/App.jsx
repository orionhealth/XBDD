import React from "react";
import TagListContainer from "./modules/tag-list/containers/TagListContainer";
import Report from "./models/Report";
import "./App.css";
import tagListData from "./resources/tag-response.json";

const App = () => {
    const dummyReport = new Report(tagListData);
    return (
        <div className="xbdd-app">
            <TagListContainer report={dummyReport} />
        </div>
    );
};

export default App;
