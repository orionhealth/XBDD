import React, { FC, MouseEvent, useState } from 'react';
import { ListItem, ListItemText, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useTagListItemStyles } from './styles/TagListStyles';
import TagViewFeatureList from './TagViewFeatureList';
import Tag from 'models/Tag';
import TagAvatar from './TagAvatar';
import { ignoreTagWithRollback, assignUserToTagWithRollback } from 'redux/TagsMetadataReducer';
import ConfirmationDialog from '../../../../confirmationDialog/ConfirmationDialog';
import { RootStore } from 'rootReducer';

interface Props {
  isEditMode: boolean;
  isAssignedTagsView: boolean;
  tag: Tag;
  selectedFeatureId?: string;
}

const TagListItem: FC<Props> = ({ isEditMode, isAssignedTagsView, tag, selectedFeatureId }) => {
  const [expanded, setExpanded] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const user = useSelector((state: RootStore) => state.user);
  const tagAssignments = useSelector((state: RootStore) => state.tags.assignments);
  const isIgnored = useSelector((state: RootStore) => Boolean(state.tags.ignored?.[tag.name]));
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useTagListItemStyles();

  if (!(user && tagAssignments)) {
    return null;
  }

  const { name } = tag;
  const currentAssignee = tagAssignments[name];
  const newAssignee = user.userId !== currentAssignee?.userId ? user : undefined;

  if (isAssignedTagsView && isIgnored) {
    return null;
  }

  const onTagIgnoreClick = (e: MouseEvent): void => {
    e.stopPropagation();
    dispatch(ignoreTagWithRollback(name));
  };

  const onAvatarClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (currentAssignee && user.userId !== currentAssignee?.userId) {
      setWarningOpen(true);
    } else {
      dispatch(assignUserToTagWithRollback(name, currentAssignee, newAssignee));
    }
  };

  return (
    <>
      <ListItem button onClick={(): void => setExpanded(!expanded)} className={classes.listItem}>
        {isEditMode && (
          <FontAwesomeIcon icon={isIgnored ? faMinusSquare : faSquare} className={classes.checkboxIcons} onClick={onTagIgnoreClick} />
        )}
        <ListItemText>{name}</ListItemText>
        <TagAvatar user={currentAssignee} isIgnored={isIgnored} onClick={onAvatarClick} />
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <TagViewFeatureList featureList={tag.features} selectedFeatureId={selectedFeatureId} />
      </Collapse>
      <ConfirmationDialog
        open={warningOpen}
        title={t('report.warning')}
        msg={t('report.pleaseReassignTheTag')}
        handleConfirmed={(): void => {
          dispatch(assignUserToTagWithRollback(name, currentAssignee, newAssignee));
          setWarningOpen(false);
        }}
        handleClosed={(): void => setWarningOpen(false)}
      />
    </>
  );
};

export default TagListItem;
