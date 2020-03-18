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
import Status from 'models/Status';
import TagAvatar from './TagAvatar';

interface Props extends WithStyles {
  loggedInUserName: string;
  isEditMode: boolean;
  isAssignedTagsView: boolean;
  tag: Tag;
  restId: string;
  selectedFeatureId: string;
  selectedStatus: Status;
  handleFeatureSelected(): void;
  handleTagAssigned(restId: string, name: string, loggedInUserName: string, userName?: string): void;
  handleWarningShow(restId: string, name: string, loggedInUserName: string, userName?: string): void;
  handleTagIgnore(productId: string, name: string): void;
}

const TagListItem: FC<Props> = ({
  loggedInUserName,
  isEditMode,
  isAssignedTagsView,
  tag,
  selectedFeatureId,
  restId,
  selectedStatus,
  handleFeatureSelected,
  handleTagAssigned,
  handleWarningShow,
  handleTagIgnore,
  classes,
}) => {
  const [expanded, setExpanded] = useState(false);
  const featureList = tag.features.filter(feature => selectedStatus[feature.calculatedStatus]);
  const { userName, name, isIgnored } = tag;

  const onAvatarClick = (event: MouseEvent): void => {
    event.stopPropagation();
    if (userName && userName !== loggedInUserName) {
      handleWarningShow(restId, name, loggedInUserName, userName);
    } else {
      handleTagAssigned(restId, name, loggedInUserName, userName);
    }
  };

  return isAssignedTagsView && isIgnored ? null : (
    <>
      <ListItem button onClick={(): void => setExpanded(!expanded)} className={classes.listItem}>
        {isEditMode && (
          <FontAwesomeIcon
            icon={isIgnored ? faMinusSquare : faSquare}
            className={classes.checkboxIcons}
            onClick={(event: MouseEvent): void => {
              event.stopPropagation();
              handleTagIgnore(restId.split('/')[0], name);
            }}
          />
        )}
        <ListItemText>{tag.name}</ListItemText>
        <TagAvatar tag={tag} onClick={(e: MouseEvent): void => onAvatarClick(e)} />
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <TagViewFeatureList selectedFeatureId={selectedFeatureId} featureList={featureList} handleFeatureSelected={handleFeatureSelected} />
      </Collapse>
    </>
  );
};

export default withStyles(tagListItemStyles)(TagListItem);
