import React, { FC, MouseEvent, useState } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

import { tagListItemStyles } from './styles/TagListStyles';
import TagViewFeatureList from './TagViewFeatureList';
import Tag from 'models/Tag';
import { StatusMap } from 'models/Status';
import TagAvatar from './TagAvatar';
import TagAssignments from 'models/TagAssignments';
import TagsIgnored from 'models/TagsIgnored';
import { User } from 'models/User';

interface Props extends WithStyles {
  isEditMode: boolean;
  isAssignedTagsView: boolean;
  tag: Tag;
  tagAssignments: TagAssignments;
  tagsIgnored: TagsIgnored;
  restId: string;
  selectedFeatureId: string;
  selectedStatus: StatusMap<boolean>;
  handleFeatureSelected(): void;
  handleTagAssigned(restId: string, name: string, currentlyAssignedUser?: User): void;
  handleTagIgnore(productId: string, name: string): void;
}

const TagListItem: FC<Props> = ({
  isEditMode,
  isAssignedTagsView,
  tag,
  tagAssignments,
  tagsIgnored,
  selectedFeatureId,
  restId,
  selectedStatus,
  handleFeatureSelected,
  handleTagAssigned,
  handleTagIgnore,
  classes,
}) => {
  const [expanded, setExpanded] = useState(false);
  const featureList = tag.features.filter(feature => selectedStatus[feature.calculatedStatus]);
  const { name } = tag;
  const user = tagAssignments[name];
  const isIgnored = tagsIgnored[name];

  if (isAssignedTagsView && isIgnored) {
    return null;
  }

  const onTagIgnoreClick = (event: MouseEvent): void => {
    event.stopPropagation();
    handleTagIgnore(restId.split('/')[0], name);
  };

  const onAvatarClick = (event: MouseEvent): void => {
    event.stopPropagation();

    // TODO there is a potential but here as an undefined username can happen in two cases. Fix this when converting FeatureListContainer to TS
    handleTagAssigned(restId, name, user);
  };

  return (
    <>
      <ListItem button onClick={(): void => setExpanded(!expanded)} className={classes.listItem}>
        {isEditMode && (
          <FontAwesomeIcon icon={isIgnored ? faMinusSquare : faSquare} className={classes.checkboxIcons} onClick={onTagIgnoreClick} />
        )}
        <ListItemText>{tag.name}</ListItemText>
        <TagAvatar user={user} isIgnored={isIgnored} onClick={onAvatarClick} />
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <TagViewFeatureList selectedFeatureId={selectedFeatureId} featureList={featureList} handleFeatureSelected={handleFeatureSelected} />
      </Collapse>
    </>
  );
};

export default withStyles(tagListItemStyles)(TagListItem);
