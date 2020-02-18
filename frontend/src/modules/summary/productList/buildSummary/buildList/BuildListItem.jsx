import React from "react";
import { ListItem, ListItemIcon, ListItemText, Checkbox } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { withStyles } from "@material-ui/core/styles";

import { buildListItemStyles } from "./styles/BuildListStyles";

const BuildListItem = props => {
  const { product, version, isPinned, buildList, handlePinChange, clickEventWrapper, classes } = props;

  return buildList.map(build => (
    <ListItem
      button
      divider
      key={build}
      className={classes.buildListItem}
      onClick={e => clickEventWrapper(e, product, version, build, isPinned, handlePinChange)}
    >
      <ListItemText>Build {build}</ListItemText>
      <ListItemIcon className={classes.listItemIcon}>
        <Checkbox icon={<FontAwesomeIcon icon={faThumbtack} />} checkedIcon={<FontAwesomeIcon icon={faThumbtack} />} checked={isPinned} />
      </ListItemIcon>
    </ListItem>
  ));
};

export default withStyles(buildListItemStyles)(BuildListItem);
