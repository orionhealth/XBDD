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

const ProductListItem = props => {
  return (
    <div>
      <ListItem button divider className={props.classes.productListItem}>
        <ListItemIcon>
          <Checkbox
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            checked={props.product.favourite}
            onClick={() => props.handleFavouriteChange(props.product)}
          />
        </ListItemIcon>
        <ListItemText onClick={() => props.handleProductClicked(props.product)}>{props.product.name}</ListItemText>
      </ListItem>
    </div>
  );
};

export default withStyles(welcomeStyles)(ProductListItem);
