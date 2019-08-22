import React from "react";
import PropTypes from "prop-types";
import { List, ListItem, ListItemIcon, ListItemText, Checkbox } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { withStyles } from "@material-ui/core/styles";
import BuildListStyles from "./styles/BuildListStyles";
import Product from "../../../../../models/Product";
import Version from "../../../../../models/Version";

const renderBuildListByPin = (buildList, handlePinChange, product, version, isPinned, classes) => (
  <List>
    {buildList.map(build => (
      <ListItem button divider key={build} className={classes.buildListItem}>
        <ListItemText>Build {build}</ListItemText>
        <ListItemIcon className={classes.listItemIcon}>
          <Checkbox
            icon={<FontAwesomeIcon icon={faThumbtack} />}
            checkedIcon={<FontAwesomeIcon icon={faThumbtack} />}
            checked={isPinned}
            onClick={e => handlePinChange(e, product, version, build, isPinned)}
          />
        </ListItemIcon>
      </ListItem>
    ))}
  </List>
);

const BuildList = props => {
  const { product, version } = props;
  const pinnedBuildList = version.pinnedBuildList;
  const otherBuildList = version.getUnpinnedBuildList();

  return (
    <div className={props.classes.buildListContainer}>
      {pinnedBuildList.length !== 0
        ? renderBuildListByPin(pinnedBuildList, props.handlePinChange, product, version, true, props.classes)
        : null}
      {otherBuildList.length !== 0
        ? renderBuildListByPin(otherBuildList, props.handlePinChange, product, version, false, props.classes)
        : null}
    </div>
  );
};

BuildList.propTypes = {
  product: PropTypes.instanceOf(Product),
  version: PropTypes.instanceOf(Version),
  handlePinChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}),
};

export default withStyles(BuildListStyles)(BuildList);
