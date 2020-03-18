import React, { FC, MouseEvent, useState, useEffect } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
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

  useEffect(() => {
    if (isIgnored && !isEditMode) {
      setExpanded(false);
    }
  }, [isIgnored, isEditMode]);

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
      <ListItem
        button
        disabled={isIgnored && !isEditMode}
        onClick={(): void => setExpanded(!expanded)}
        className={isIgnored && !isEditMode ? classes.ignoredListItem : classes.listItem}
      >
        {isEditMode && (
          <FontAwesomeIcon
            icon={isIgnored ? faMinusSquare : faSquare}
            className={isIgnored ? `${classes.checkboxIcons} ${classes.ignoredColor}` : classes.checkboxIcons}
            onClick={(event: MouseEvent): void => {
              event.stopPropagation();
              handleTagIgnore(restId.split('/')[0], name);
            }}
          />
        )}
        <ListItemIcon className={classes.listItemIcon}>
          <span className={isIgnored ? classes.ignoredColor : undefined}>
            <FontAwesomeIcon icon={faTag} />
          </span>
        </ListItemIcon>
        <ListItemText className={isIgnored ? classes.ignoredColor : undefined}>{tag.name}</ListItemText>
        <TagAvatar tag={tag} onClick={(e: MouseEvent): void => onAvatarClick(e)} />
        {!isIgnored && !isEditMode && (expanded ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      <Collapse in={!(isIgnored && !isEditMode) && expanded} timeout="auto" unmountOnExit>
        <TagViewFeatureList selectedFeatureId={selectedFeatureId} featureList={featureList} handleFeatureSelected={handleFeatureSelected} />
      </Collapse>
    </>
  );
};

export default withStyles(tagListItemStyles)(TagListItem);
