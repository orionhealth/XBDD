import React from 'react';
import { shallow, mount } from 'enzyme';
import TagListFilterButtonsView from '../../../modules/tag-list/components/TagListFilterButtonsView';

const filterStates = {
    passedSelected: true,
    undefinedSelected: true,
    failedSelected: true,
    skippedSelected: true,
};

test('TagListButtonsView renders', () => {
    const buttonView = shallow(<TagListFilterButtonsView
        filterStates={filterStates}
        onFilterButtonClick={() => {}}
    />);
    expect(buttonView).toMatchSnapshot();
});

test('TagListButtonsView renders 4 buttons', () => {
    const buttonView = mount(<TagListFilterButtonsView
        filterStates={filterStates}
        onFilterButtonClick={() => {}}
    />);
    expect(buttonView.find('button')).toHaveLength(4);
});

test('TagListButtonsView renders button with primary color when selected', () => {
    const buttonView = mount(<TagListFilterButtonsView
        filterStates={filterStates}
        onFilterButtonClick={() => {}}
    />);
    expect(buttonView.find('button').get(0).props.className).toContain('Primary');
});

test('TagListButtonsView renders button with secondary color when not selected', () => {
    const filterStatesFalse = {
        passedSelected: false,
        undefinedSelected: false,
        failedSelected: false,
        skippedSelected: false,
    };
    const buttonView = mount(<TagListFilterButtonsView
        filterStates={filterStatesFalse}
        onFilterButtonClick={() => {}}
    />);
    expect(buttonView.find('button').get(0).props.className).toContain('Secondary');
});
