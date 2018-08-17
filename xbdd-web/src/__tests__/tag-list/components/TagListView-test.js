import React from "react";
import { shallow, mount } from "enzyme";
import TagListView from "../../../modules/tag-list/components/TagListView";
import TagListItemView from "../../../modules/tag-list/components/TagListItemView";
import TagListFilterButtonsView from "../../../modules/tag-list/components/TagListFilterButtonsView";
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

test("TagListView renders", () => {
    const tagList = shallow(<TagListView tags={dummyTags} filterStates={filterStates} />);
    expect(tagList).toMatchSnapshot();
});

test("TagListView renders TagListFilterButtonsView", () => {
    const tagList = mount(<TagListView tags={dummyTags} filterStates={filterStates} />);
    expect(tagList.find(TagListFilterButtonsView)).toHaveLength(1);
});

test("TagListView renders the right number of tags", () => {
    const tagList = mount(<TagListView tags={dummyTags} filterStates={filterStates} />);
    expect(tagList.find(TagListItemView)).toHaveLength(2);
});
