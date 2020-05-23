import React, { FC, MouseEvent, useState } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { tagListItemStyles } from './styles/TagListStyles';
import TagViewFeatureList from './TagViewFeatureList';
import Tag from 'models/Tag';
import { StatusMap } from 'models/Status';
import TagAvatar from './TagAvatar';
import TagAssignments from 'models/TagAssignments';
import { ignoreTagWithRollback, assignUserToTagWithRollback } from 'redux/TagsMetadataReducer';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import { RootStore } from 'rootReducer';

interface Props extends WithStyles {
  productId: string;
  versionString: string;
  isEditMode: boolean;
  isAssignedTagsView: boolean;
  tag: Tag;
  tagAssignments: TagAssignments;
  restId: string;
  selectedFeatureId?: string;
  selectedStatus: StatusMap<boolean>;
}

const TagListItem: FC<Props> = ({
  productId,
  versionString,
  isEditMode,
  isAssignedTagsView,
  tag,
  tagAssignments,
  selectedFeatureId,
  restId,
  selectedStatus,
  classes,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const user = useSelector((state: RootStore) => state.user);
  const isIgnored = useSelector((state: RootStore) => Boolean(state.tags.ignored?.[tag.name]));
  const dispatch = useDispatch();
  const { t } = useTranslation();

  if (!user) {
    return null;
  }

  const featureList = tag.features.filter(feature => selectedStatus[feature.calculatedStatus]);
  const { name } = tag;
  const currentAssignee = tagAssignments[name];
  const newAssignee = user.userId !== currentAssignee?.userId ? user : undefined;

  if (isAssignedTagsView && isIgnored) {
    return null;
  }

  const onTagIgnoreClick = (event: MouseEvent): void => {
    event.stopPropagation();
    dispatch(ignoreTagWithRollback(restId.split('/')[0], name));
  };

  const onAvatarClick = (event: MouseEvent): void => {
    event.stopPropagation();
    if (currentAssignee?.userId && user.userId !== currentAssignee?.userId) {
      setWarningOpen(true);
    } else {
      dispatch(assignUserToTagWithRollback(restId, tag.name, currentAssignee, newAssignee));
    }
  };

  return (
    <>
      <ListItem button onClick={(): void => setExpanded(!expanded)} className={classes.listItem}>
        {isEditMode && (
          <FontAwesomeIcon icon={isIgnored ? faMinusSquare : faSquare} className={classes.checkboxIcons} onClick={onTagIgnoreClick} />
        )}
        <ListItemText>{tag.name}</ListItemText>
        <TagAvatar user={currentAssignee} isIgnored={isIgnored} onClick={onAvatarClick} />
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <TagViewFeatureList
          productId={productId}
          versionString={versionString}
          selectedFeatureId={selectedFeatureId}
          featureList={featureList}
        />
      </Collapse>
      <ConfirmationDialog
        open={warningOpen}
        title={t('report.warning')}
        msg={t('report.pleaseReassignTheTag')}
        handleConfirmed={(): void => {
          dispatch(assignUserToTagWithRollback(restId, tag.name, currentAssignee, newAssignee));
          setWarningOpen(false);
        }}
        handleClosed={(): void => setWarningOpen(false)}
      />
    </>
  );
};

export default withStyles(tagListItemStyles)(TagListItem);
