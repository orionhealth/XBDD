import React from "react";
import TagListContainer from "./modules/tag-list/TagListContainer";
import Report from "./models/Report";
import "./App.css";
import tagListData from "./resources/tag-response.json";

const App = () => {
    // TODO remove all dummy data once hooked up to backend
    const dummyReport = new Report(tagListData);
    return (
        <div className="xbdd-app">
            <TagListContainer report={dummyReport} />
        </div>
    );
};

export default App;
