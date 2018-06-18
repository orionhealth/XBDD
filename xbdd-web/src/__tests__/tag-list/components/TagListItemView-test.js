import React from 'react';
import { shallow } from 'enzyme';
import TagListItemView from '../../../modules/tag-list/components/TagListItemView';
import Tag from '../../../models/Tag';

const dummyTag = new Tag({
    tag: 'testTagOne',
    features: [],
});

test('TagListItemView renders', () => {
    const t = true;
    const tagList = shallow(<TagListItemView
        tag={dummyTag}
        onSelectTag={() => {}}
        isSelected={t}
    />);
    expect(tagList).toMatchSnapshot();
});
