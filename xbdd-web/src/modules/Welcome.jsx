import React from "react";
import { Grid, Card, Typography } from "@material-ui/core";
import ProductList from "./ProductList";
import welcomeStyles from "./WelcomeStyles"
import {withStyles} from "@material-ui/core/styles"

const Welcome = props => {
  return (
    <Card>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h3" className={props.classes.title}>Welcome</Typography>
        </Grid>
        <Grid item xs={6} className={props.classes.productList}>
          <ProductList summaryData={props.summaryData} isFavouriteList={false}/>
        </Grid>
        <Grid item xs={6} className={props.classes.productList}> 
          <ProductList summaryData={props.summaryData} isFavouriteList={true}/>
        </Grid>
      </Grid>
    </Card>
  );
};

export default withStyles(welcomeStyles) (Welcome);
