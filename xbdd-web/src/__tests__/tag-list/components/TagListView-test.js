import React from "react";
import { shallow, mount } from "enzyme";
import TagListView from "../../../modules/tag-list/TagListView";
import TagListItemView from "../../../modules/tag-list/widgets/TagListItemView";
import TagListFilterButtonsView from "../../../modules/tag-list/widgets/TagListFilterButtonsView";
import Tag from "../../../models/Tag";

const filterStates = {
    passedSelected: true,
    undefinedSelected: true,
    failedSelected: true,
    skippedSelected: true,
};

const dummyTags = [
    new Tag({
        tag: "testTagOne",
        features: [],
    }),
    new Tag({
        tag: "testTagTwo",
        features: [],
    }),
];

describe("TagListView", () => {
    test("renders", () => {
        const tagList = shallow(<TagListView tags={dummyTags} filterStates={filterStates} />);
        expect(tagList).toMatchSnapshot();
    });

    test("renders TagListFilterButtonsView", () => {
        const tagList = mount(<TagListView tags={dummyTags} filterStates={filterStates} />);
        expect(tagList.find(TagListFilterButtonsView)).toHaveLength(1);
    });

    test("renders the right number of tags", () => {
        const tagList = mount(<TagListView tags={dummyTags} filterStates={filterStates} />);
        expect(tagList.find(TagListItemView)).toHaveLength(2);
    });
});
