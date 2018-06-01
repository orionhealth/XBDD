import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Tag from '../../../models/Tag';
import TagListItemView from './TagListItemView';
import TagListFilterButtonsView from './TagListFilterButtonsView';
import { tagListStyles } from '../styles/TagListStyles';

const mapTagToTagListItem = (tag, selectedTag, onSelectTag) => (
    <TagListItemView
        tag={tag}
        key={tag.name}
        onSelectTag={onSelectTag}
        isSelected={tag === selectedTag}
    />);

const renderList = (tags, selectedTag, onSelectTag) => (
    <List component="ul" >
        {tags.map(tag => mapTagToTagListItem(tag, selectedTag, onSelectTag))}
    </List>);

const TagListView = props => (
    <div className={props.classes.xbddTagListContainer}>
        <TagListFilterButtonsView
            filterStates={props.filterStates}
            onFilterButtonClick={props.onFilterButtonClick}
        />
        <div className={props.classes.xbddTagList}>
            {renderList(props.tags, props.selectedTag, props.onSelectTag)}
        </div>
    </div>
);

TagListView.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.instanceOf(Tag)).isRequired,
    selectedTag: PropTypes.instanceOf(Tag),
    filterStates: PropTypes.object.isRequired,
    onSelectTag: PropTypes.func.isRequired,
    onFilterButtonClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

TagListView.defaultProps = {
    selectedTag: null,
};

export default withStyles(tagListStyles)(TagListView);
