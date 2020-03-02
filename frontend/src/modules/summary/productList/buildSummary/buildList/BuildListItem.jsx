import React from 'react';
import { ListItem, ListItemIcon, ListItemText, Checkbox } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { grey } from '@material-ui/core/colors';

const BuildListItem = props => {
  const { product, version, isPinned, buildList, handlePinChange, clickEventWrapper } = props;

  return buildList.map(build => (
    <ListItem button key={build} onClick={e => clickEventWrapper(e, product, version, build, isPinned, handlePinChange)}>
      <ListItemText>Build {build}</ListItemText>
      <ListItemIcon>
        <Checkbox
          icon={<FontAwesomeIcon icon={faThumbtack} style={{ color: grey[300] }} />}
          checkedIcon={<FontAwesomeIcon icon={faThumbtack} style={{ color: grey[700] }} />}
          checked={isPinned}
        />
      </ListItemIcon>
    </ListItem>
  ));
};

export default BuildListItem;
