import React from "react";
import sinon from "sinon";
import { shallow, mount } from "enzyme";
import TagListItemView from "../../../modules/tag-list/widgets/TagListItemView";
import Tag from "../../../models/Tag";

const dummyTag = new Tag({
    tag: "testTagOne",
    features: [],
});

describe("TagListItemView", () => {
    test("renders", () => {
        const t = true;
        const tagListItem = shallow(
            <TagListItemView tag={dummyTag} onSelectTag={() => {}} isSelected={t} />
        );
        expect(tagListItem).toMatchSnapshot();
    });

    test("onSelectTag function is called when tag is clicked", () => {
        const t = true;
        const onClick = sinon.spy();
        const tagListItem = mount(
            <TagListItemView tag={dummyTag} onSelectTag={onClick} isSelected={t} />
        );

        tagListItem.simulate("click");

        expect(onClick.called).toEqual(true);
    });
});
