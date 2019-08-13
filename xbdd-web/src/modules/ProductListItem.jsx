import React, { Component } from 'react'
import {Checkbox, ListItem, FormControlLabel} from "@material-ui/core";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import { setProductFavouriteOn, setProductFavouriteOff } from "../lib/rest/Rest";
import { withStyles } from "@material-ui/core/styles";
import welcomeStyles from "./WelcomeStyles";

const ProductListItem = props => {
    // handleFavouriteChange() {
    //     if(this.product.favourite) {
    //       setProductFavouriteOff(this.product.name).then(response => {
    //           if (response.status === 200) {
    //             this.props.onFavouriteChange();
    //           }
    //       });
    //     } else {
    //       setProductFavouriteOn(this.product.name).then(response => {
    //         if (response.status === 200) {
    //             this.props.onFavouriteChange();
    //           }
    //       });
    //     }
    //   }

    return (
        <ListItem button divider className={props.classes.productListItem}> 
        <FormControlLabel
            control={<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} checked={props.product.favourite} onChange={()=>props.onFavouriteChange(props.product)}/>}
            label={props.product.name}
        />
        </ListItem>
    )
}

export default withStyles(welcomeStyles)(ProductListItem);
