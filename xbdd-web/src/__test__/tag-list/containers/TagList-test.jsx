import React from 'react';
import { shallow } from 'enzyme';
import Report from '../../models/Report';
import TagList from '../../components/tag-list/TagList';
import dummyData from '../../resources/tag-response.json';

test('TagList renders renders the list', () => {
    const dummyReport = new Report(dummyData);
    const tagList = shallow(<TagList report={dummyReport} />);
    expect(tagList.find);
});
