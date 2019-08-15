import React from "react";
import { Checkbox, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import { withStyles } from "@material-ui/core/styles";
import welcomeStyles from "./WelcomeStyles";

import List from "@material-ui/core/List";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

class ProductListItem extends React.Component {
  constructor(props) {
    super(props);
    this.clickEventWrapper = this.clickEventWrapper.bind(this);
  }

  clickEventWrapper(event) {
    let node = event.target;

    while (node) {
      if (node.className === "MuiIconButton-label") {
        this.props.handleFavouriteChange(this.props.product);
        return;
      }
      node = node.parentNode;
    }
    this.props.handleProductClicked(this.props.product);
  }

  render() {
    return (
      <div onClick={this.clickEventWrapper}>
        <ListItem button divider className={this.props.classes.productListItem}>
          <ListItemIcon>
            <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} checked={this.props.product.favourite} />
          </ListItemIcon>
          <ListItemText>{this.props.product.name}</ListItemText>
          {this.props.product.expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.props.product.expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <div>yeah</div>
          </List>
        </Collapse>
      </div>
    );
  }
}

export default withStyles(welcomeStyles)(ProductListItem);
