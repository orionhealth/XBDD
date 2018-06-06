import React from 'react';
import { shallow } from 'enzyme';
import Report from '../../../models/Report';
import TagListContainer from '../../../modules/tag-list/containers/TagListContainer';
import TagListView from '../../../modules/tag-list/components/TagListView';
import dummyData from '../../../resources/tag-response.json';

test('TagListContainer renders', () => {
    const dummyReport = new Report(dummyData);
    const tagList = shallow(<TagListContainer report={dummyReport} />);
    expect(tagList).toMatchSnapshot();
});

test('TagListContainer renders the TagListView', () => {
    const dummyReport = new Report(dummyData);
    const tagList = shallow(<TagListContainer report={dummyReport} />);
    expect(tagList.find(TagListView)).toHaveLength(1);
});
