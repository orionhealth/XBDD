import React from "react";
import { shallow, mount } from "enzyme";
import Report from "../../../models/Report";
import TagListContainer from "../../../modules/tag-list/TagListContainer";
import TagListView from "../../../modules/tag-list/TagListView";

const dummyReport = new Report([
    {
        tag: "testTagOne",
        features: [{ elements: [{ steps: [{ result: { status: "passed" } }] }] }],
    },
]);

describe("TagListContainer", () => {
    test("renders", () => {
        const tagList = shallow(<TagListContainer report={dummyReport} />);
        expect(tagList).toMatchSnapshot();
    });

    test("renders the TagListView", () => {
        const tagList = shallow(<TagListContainer report={dummyReport} />);
        expect(tagList.find(TagListView)).toHaveLength(1);
    });

    test("button click changes filter button state", () => {
        const tagList = mount(<TagListContainer report={dummyReport} />);
        tagList
            .findWhere(n => n.props().title === "Passed")
            .first()
            .simulate("click");
        expect(tagList.state().filterStates.passedSelected).toEqual(false);
    });
});
