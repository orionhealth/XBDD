import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Tag from '../../models/Tag';
import TagListItemView from './widgets/TagListItemView';
import TagListFilterButtonsView from './widgets/TagListFilterButtonsView';
import { tagListStyles } from './styles/TagListStyles';

const mapTagToTagListItem = (tag, selectedTag, onSelectTag) => (
  <TagListItemView tag={tag} key={tag.name} onSelectTag={onSelectTag} isSelected={tag === selectedTag} />
);

const renderList = (className, tags, selectedTag, onSelectTag) => {
  if (!tags.length) {
    return null;
  }
  return (
    <div className={className}>
      <List component="ul">{tags.map(tag => mapTagToTagListItem(tag, selectedTag, onSelectTag))}</List>
    </div>
  );
};

const TagListView = props => (
  <div className={props.classes.xbddTagListContainer}>
    <TagListFilterButtonsView filterStates={props.filterStates} onFilterButtonClick={props.onFilterButtonClick} />
    {renderList(props.classes.xbddTagList, props.tags, props.selectedTag, props.onSelectTag)}
  </div>
);

TagListView.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.instanceOf(Tag)),
  selectedTag: PropTypes.instanceOf(Tag),
  filterStates: PropTypes.shape({}).isRequired,
  onSelectTag: PropTypes.func,
  onFilterButtonClick: PropTypes.func,
  classes: PropTypes.shape({
    xbddTagListContainer: PropTypes.string,
    xbddTagList: PropTypes.string,
  }).isRequired,
};

TagListView.defaultProps = {
  tags: [],
  selectedTag: null,
  onSelectTag: () => {},
  onFilterButtonClick: () => {},
};

export default withStyles(tagListStyles)(TagListView);
